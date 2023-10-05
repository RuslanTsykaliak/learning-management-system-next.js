import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

// Define an asynchronous DELETE function for handling the deletion of an attachment associated with a course.
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string, attachmentId: string } }
) {
  try {
    // Get the user's ID from authentication
    const { userId } = auth();

    // If the user is not authenticated, return an unauthorized Next.js response
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

    // Delete the attachment associated with the specified course and attachment ID
    const attachment = await db.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      }
    });

    // Return a JSON response with the deleted attachment
    return NextResponse.json(attachment);
  } catch (error) {
    // Log any errors and return an internal server error response
    console.log("ATTACHMENT_ID", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
