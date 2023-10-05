import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

// Define an asynchronous POST function for handling the creation of an attachment associated with a course.

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Get the user's ID from authentication
    const { userId } = auth();
    
    // Get the URL from the request body
    const { url } = await req.json();

    // If the user is not authenticated, return an unauthorized response
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the course owner matches the authenticated user
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      }
    });

    // If the course owner is not found, return an unauthorized response
    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Create a new attachment in the database associated with the specified course. split(/) spits a string on the forward slash (/) character and return the last element of the resulting array. pop() removes and return the last element from an array and returns it.
    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split('/').pop(),
        courseId: params.courseId,
      }
    });

    // Return a JSON response with the created attachment
    return NextResponse.json(attachment);
  } catch (error) {
    // Log any errors and return an internal server error response
    console.log('COURSE_ID_ATTACHMENTS', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
