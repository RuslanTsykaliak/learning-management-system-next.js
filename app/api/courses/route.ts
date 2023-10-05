import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

// Define an asynchronous function named POST that handles a POST request.
export async function POST(
  req: Request,
) {
  try {
    // Retrieve the user ID from the authentication token.
    const { userId } = auth();

    // Retrieve the course title from the request body.
    const { title } = await req.json();

    // Check if the user is authenticated and is a teacher.
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create a new course in the database with the provided title and user ID.
    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    // Return a JSON response containing the newly created course.
    return NextResponse.json(course);
  } catch (error) {
    // Handle errors and log them.
    console.log("[COURSES]", error);

    // Return an internal server error response.
    return new NextResponse("Internal Error", { status: 500 });
  }
}
