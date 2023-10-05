import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const{ Video } = new Mux(
process.env.MUX_TOKEN_ID!,
process.env.MUX_TOKEN_SECRET!,
)

// DELETE function to delete a chapter
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course owner to verify authorization
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    // If the course owner is not found, return unauthorized
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the chapter to be deleted
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    // If the chapter is not found, return not found
    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Check if the chapter has a videoUrl
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      // If Mux data exists, delete the asset and Mux data
      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    // Delete the chapter from the database
    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    // Check if there are published chapters left in the course
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    // If no published chapters are left, update the course to unpublished
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

    // Return a JSON response containing the deleted chapter
    return NextResponse.json(deletedChapter);
  } catch (error) {
    // Handle errors and log them
    console.log("[CHAPTER_ID_DELETE]", error);

    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH function to update a chapter
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course owner to verify authorization
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    // If the course owner is not found, return unauthorized
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the chapter with the provided values
    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    // Check if the updated chapter has a videoUrl
    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      // If Mux data exists, delete the asset and Mux data
      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      // Create a new Mux asset and Mux data
      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: "public",
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    // Return a JSON response containing the updated chapter
    return NextResponse.json(chapter);
  } catch (error) {
    // Handle errors and log them
    console.log("[COURSES_CHAPTER_ID]", error);

    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  }
}
