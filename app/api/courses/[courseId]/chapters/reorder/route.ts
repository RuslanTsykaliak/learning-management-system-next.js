import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

// handels a PUT request.
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Parse the JSON data from the request body.
    const { list } = await req.json()

    // Check if the user owns the course based on courseId
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      }
    })

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Iterate through the list of items and update their positions in the database
    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      })
    }

    return new NextResponse('Success', { status: 200 })
  } catch (error) {
    console.log('[REORDER]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}