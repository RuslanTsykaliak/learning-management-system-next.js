import { Category, Course } from "@prisma/client";

import { CourseCard } from "@/components/CourseCard";

type CourseWithProgressWithCategory = Course & {
  category: Category | null; // Include category information in the course data.
  chapters: { id: string }[]; // List of chapters associated with the course.
  progress: number | null; // Course progress as a percentage (null if not available).
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[]; // List of courses to display.
}

export const CoursesList = ({
  items // List of courses to display.
}: CoursesListProps) => {
  return (
    <div>
      {/* Create a grid layout to display courses in columns based on screen size. */}
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {/* Map through the list of courses and render CourseCard component for each course. */}
        {items.map((item) => (
          <CourseCard
            key={item.id} // Unique key for React rendering.
            id={item.id} // Course ID.
            title={item.title} // Course title.
            imageUrl={item.imageUrl!} // Course image URL (assuming it's always available (!)).
            chaptersLength={item.chapters.length} // Number of chapters in the course.
            price={item.price!} // Course price (assuming it's always available).
            progress={item.progress} // Course progress (null if not available).
            category={item?.category?.name!} // Course category name (assuming it's always available (!)).
          />
        ))}
      </div>
      {/* Display a message if no courses are found. */}
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  )
}
