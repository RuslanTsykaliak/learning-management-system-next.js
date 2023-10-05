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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    // If the course is not found, return a not found response
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Check if the course has all required fields and at least one published chapter
    const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);
    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      return new NextResponse("Missing required fields", { status: 401 });
    }

    // Update the course to set isPublished to true (publish)
    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    // Return a JSON response containing the updated (published) course
    return NextResponse.json(publishedCourse);
  } catch (error) {
    // Handle errors and log them
    console.log("[COURSE_ID_PUBLISH]", error);

    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  }
}
