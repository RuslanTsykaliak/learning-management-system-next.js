import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// export an asynchronous POST function for handling Stipe webhook events.
export async function POST(req: Request) {
  // Parse the request body as text
  const body = await req.text();

  // Get the Sripe signature form the request headers
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event

  try {
    // Construct the Stripe event using the request body and signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    // Return a 400 Bad Request error with an error message is webhook validation fails
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Extract metadata from the Sripe event's session object
  const session = event.data.object as Stripe.Checkout.Session
  const userId = session?.metadata?.userId
  const courseId = session?.metadata?.courseId

  // Handle the 'checkout.session.completed' event type
  if (event.type === 'checkout.session.completed') {
    // Check if user ID or course ID metadata is missing
    if (!userId || !courseId) {
      return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 })
    }

    // Create a purchase record in the database
    await db.purchase.create({
      data: {
        courseId: courseId,
        userId: userId,
      }
    })
  } else {
    // Return a 200 OK response for unhandled event types
    return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 })
  }

  // Return a 200 OK response for successful webhook handling
  return new NextResponse(null, { status: 200 })
}
