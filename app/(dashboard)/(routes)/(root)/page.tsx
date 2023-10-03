import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { getDashboardCourses } from "@/actions/getDashboardCourses";
import { CoursesList } from "@/components/CoursesList";

import { InfoCard } from "./_components/InfoCard";

// Define a Dashboard component that displays user-specific course information.
export default async function Dashboard() {
  // Get the user's ID from the authentication system
  const { userId } = auth();

  // If the user is not authenticated, redirect them to the homepage
  if (!userId) {
    return redirect('/');
  }

  // Fetch the user's completed and in-progress courses
  const {
    completedCourses,
    coursesInProgress,
  } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      {/* Display information cards for in-progress and completed courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label='In Progress'
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label='Completed'
          numberOfItems={completedCourses.length}
          variant='success'
        />
      </div>

      {/* Display a list of courses, combining in-progress and completed courses */}
      <CoursesList
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  )
}
