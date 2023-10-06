import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse the request body to get the isCompleted value
    const { isCompleted } = await req.json();

    // Upsert (update or create) the user's progress for the specified chapter
    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted,
      },
    });

    // Return a JSON response containing the updated user progress
    return NextResponse.json(userProgress);
  } catch (error) {
    // Handle errors and log them
    console.log("[CHAPTER_ID_PROGRESS]", error);

    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  }
}
