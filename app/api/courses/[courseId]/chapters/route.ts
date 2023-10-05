import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

// POST function to create a new chapter within a course
export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course owner to verify authorization
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    // If the course owner is not found, return unauthorized
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the last chapter in the course to determine the new chapter's position
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    // Calculate the new chapter's position
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // Create a new chapter with the provided title and courseId
    const { title } = await req.json();
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    // Return a JSON response containing the newly created chapter
    return NextResponse.json(chapter);
  } catch (error) {
    // Handle errors and log them
    console.log("[CHAPTERS]", error);

    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  }
}
