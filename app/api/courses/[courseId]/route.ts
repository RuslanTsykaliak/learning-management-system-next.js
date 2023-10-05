import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);

// DELETE function to delete a course and its associated chapters' Mux assets
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course associated with the courseId and user
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    // If the course doesn't exist, return a not found response
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Loop through the chapters of the course and delete associated Mux assets
    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    // Delete the course from the database
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    // Return a JSON response containing the deleted course
    return NextResponse.json(deletedCourse);
  } catch (error) {
    // Handle errors and log them
    console.log("[COURSE_ID_DELETE]", error);

    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH function to update a course
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the course with the provided values
    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    // Return a JSON response containing the updated course
    return NextResponse.json(course);
  } catch (error) {
    // Handle errors and log them
    console.log("[COURSE_ID]", error);

    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  }
}
