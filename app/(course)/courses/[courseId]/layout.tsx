import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from '@/lib/db'
import { getProgress } from "@/actions/getProgress";

import { CourseSidebar } from "./_components/CourseSidebar";
import { CourseNavbar } from "./_components/CourseNavbar";

const CourseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    // If the user is not authenticated, redirect them to the homepage
    return redirect("/");
  }

  // Fetch course details, including chapters and user progress
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            }
          }
        },
        orderBy: {
          position: "asc"
        }
      },
    },
  });

  if (!course) {
    // If the course is not found, redirect to the homepage
    return redirect("/");
  }

  // Calculate the user's progress in the course
  const progressCount = await getProgress(userId, course.id);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        {/* Render the course navigation bar with progress count */}
        <CourseNavbar
          course={course}
          progressCount={progressCount}
        />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        {/* Render the course sidebar with progress count */}
        <CourseSidebar
          course={course}
          progressCount={progressCount}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">
        {children}
      </main>
    </div>
  )
}

export default CourseLayout;
