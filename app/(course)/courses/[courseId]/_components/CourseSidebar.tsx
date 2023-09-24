import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from '@prisma/client'
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CourseProgress } from "@/components/"

import { CourseSidebarItem } from "./"

// This interface defines the props that are passed to the CourseSidebar component.
interface CourseSidebarProps {
  // The course object.
  course: Course & {
    // The course chapters, with user progress attached.
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  // The number of chapters the user has completed.
  progressCount: number;
}

// This function defines the CourseSidebar component. It takes in a CourseSidebarProps object as its prop and returns a JSX element.
export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  // Get the user ID from the authentication context.
  const { userId } = auth();

  // If the user is not logged in, redirect them to the home page.
  if (!userId) {
    return redirect('/');
  }

  // Find the user's purchase for the current course.
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  // Render the CourseSidebar component.
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">
          {course.title}
        </h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress
              variant="success"
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};
