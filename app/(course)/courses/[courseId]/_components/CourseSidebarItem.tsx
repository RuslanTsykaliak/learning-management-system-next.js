'use client'

import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";


interface CourseSidebarItemProps {
  label: string;      // The label or title of the course chapter
  id: string;         // The unique identifier for the chapter
  isCompleted: boolean;  // Indicates if the chapter is completed
  courseId: string;   // The unique identifier of the course the chapter belongs to
  isLocked: boolean;  // Indicates if the chapter is locked (requires purchase)
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  // Determine the appropriate icon based on the chapter's completion and locking status
  const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);

  // Check if the chapter's link is currently active
  const isActive = pathname?.includes(id);

  // Define the behavior when the sidebar item is clicked
  const onClick = () => {
    router.push(`/courses/${courseId}/${id}`);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        // Base styles for the button
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        // Apply these styles when the chapter is active (selected)
        isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate700",
        // Apply these styles for completed chapters
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        // Apply these styles for completed chapters when they are active (selected)
        isCompleted && isActive && "bg-emerald-200/20"
      )}

    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-slate-700",
            isCompleted && "text-emerald-700"
          )}
        />
        {label}  {/* Display the chapter's label (title) */}
      </div>
      <div className={cn(
        "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
        isActive && "opacity-100",  /* Show a border when active */
        isCompleted && "border-emerald-700"  /* Use an emerald border for completed chapters */
      )}
      />
    </button>
  );
}