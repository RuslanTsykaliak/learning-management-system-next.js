import { Menu } from "lucide-react";
import { Chapter, Course, UserProgress } from "@prisma/client"

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'

import { CourseSidebar } from "./CourseSidebar";

// This code defines a React functional component `CourseMobileSidebar` used to display the mobile version of a course sidebar.

// Define the props expected by the component.
interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  }
  progressCount: number;
}

export const CourseMobileSidebar = ({
  course,
  progressCount,
}: CourseMobileSidebarProps) => {
  return (
    // The component uses a Sheet layout to create a sidebar for mobile view.
    <Sheet>
      {/* The SheetTrigger displays a menu icon and activates the sidebar when clicked. */}
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      {/* The SheetContent component represents the sidebar itself with a specific width and styling. */}
      <SheetContent side='left' className="p-0 bg-white w-72">
        {/* The CourseSidebar component is used to display the content within the mobile sidebar. */}
        <CourseSidebar
          course={course}
          progressCount={progressCount}
        />
      </SheetContent>
    </Sheet>
  )
}
