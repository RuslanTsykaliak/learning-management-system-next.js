import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

// req: The Request object for the incoming request. params: An obnject containing the route parameters for the request.
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course that belongs to the user and matches the provided courseId
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    // If the user doesn't own the course, return an unauthorized response
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the specified chapter to set isPublished to false (unpublish)
    const unpublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });

    // Find all published chapters within the same course
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    // If there are no more published chapters in the course, set the course as unpublished
    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    // Return a JSON response containing the updated (unpublished) chapter
    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    // Handle errors and log them
    console.log("[CHAPTER_UNPUBLISH]", error);

    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  }
}
