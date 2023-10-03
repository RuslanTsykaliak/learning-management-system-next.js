import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DataTable } from
import { columns } from 

// Define a Next.js page component for displaying a user's courses.
const CoursesPage = async () => {
  // Get the user's ID from the authentication system
  const { userId } = auth();

  // If the user is not authenticated, redirect them to the homepage
  if (!userId) {
    return redirect('/');
  }

  // Fetch the user's courses, ordered by creation date
  const courses = await db.courses.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-6">
      {/* Render a DataTable component to display the user's courses */}
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursesPage;

