import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

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

    // Find the specified chapter and its associated Mux data
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId: params.chapterId,
      },
    });

    // Check if the chapter and its data are valid and contain required fields
    if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Update the specified chapter to set isPublished to true (publish)
    const publishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    // Return a JSON response containing the updated (published) chapter
    return NextResponse.json(publishedChapter);
  } catch (error) {
    // Handle errors and log them
    console.log("[CHAPTER_PUBLISH]", error);

    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  }
}
