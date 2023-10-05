import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course that belongs to the user and matches the provided courseId
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    // If the course is not found, return a not found response
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Update the course to set isPublished to false (unpublish)
    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });

    // Return a JSON response containing the updated (unpublished) course
    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    // Handle errors and log them
    console.log("[COURSE_ID_UNPUBLISH]", error);

    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  } 
}
