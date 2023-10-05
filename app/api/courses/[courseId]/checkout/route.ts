import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// Define an asynchronous function named POST that handles a POST request.
export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Retrieve the current user's information.
    const user = await currentUser();

    // Check if user information is valid (user exists, has an ID, and an email address).
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course with the specified courseId that is published.
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    // Find if the user has already purchased the course.
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    // If the user has already purchased the course, return an error response.
    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    // If the course is not found or not published, return a "Not found" response.
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Prepare line items for Stripe Checkout.
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100), // Convert price to cents.
        },
      },
    ];

    // Find or create a Stripe customer associated with the user.
    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    // If no Stripe customer is found for the user, create a new one.
    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      // Store the Stripe customer ID in the database.
      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    // Create a new Stripe Checkout session.
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });

    // Return the Stripe Checkout session URL.
    return NextResponse.json({ url: session.url });
  } catch (error) {
    // Handle errors and log them.
    console.log("[COURSE_ID_CHECKOUT]", error);

    // Return an internal server error response.
    return new NextResponse("Internal Error", { status: 500 });
  }
}
