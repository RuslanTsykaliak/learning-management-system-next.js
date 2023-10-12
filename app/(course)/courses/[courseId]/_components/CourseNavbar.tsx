import { NavbarRoutes } from "@/components/NavbarRoutes";
import { Chapter, Course, UserProgress } from "@prisma/client"
import { CourseMobileSidebar } from "./CourseMobileSidebar";

// This code defines a React functional component `CourseNavbar` used to create a navigation bar for a course.
interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[]
  }
  progressCount: number;
}

export const CourseNavbar = ({
  course,
  progressCount,
}: CourseNavbarProps) => {
  return (
    // The component defines a container div with specific styling for the navigation bar.
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      {/* The `CourseMobileSidebar` component is used to render a mobile sidebar for the course. */}
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
      />
      {/* The `NavbarRoutes` component is used to render navigation routes in the navbar. */}
      <NavbarRoutes />
    </div>
  )
}
