import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/IconBadge";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "@/components/CourseProgress";

// Define the CourseCardProps interface to specify the expected props for the CourseCard component.
interface CourseCardProps {
  id: string;                 // Unique identifier for the course
  title: string;              // Title of the course
  imageUrl: string;           // URL of the course image
  chaptersLength: number;     // Number of chapters in the course
  price: number;              // Price of the course
  progress: number | null;    // Progress (percentage) in the course, or null if not applicable
  category: string;           // Category or topic of the course
}

// Define the CourseCard React component.
export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category
}: CourseCardProps) => {
  return (
    // Wrap the card in a link that navigates to the course details page.
    <Link href={`/courses/${id}`}>
      {/* Container for the course card with hover effect. */}
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        {/* Container for the course image. */}
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          {/* Display the course image. */}
          <Image
            fill
            className="object-cover"
            alt={title}
            src={imageUrl}
          />
        </div>
        {/* Container for course details. */}
        <div className="flex flex-col pt-2">
          {/* Display the course title with a maximum of 2 lines. */}
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          {/* Display the course category or topic. */}
          <p className="text-xs text-muted-foreground">
            {category}
          </p>
          {/* Container for additional course information. */}
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              {/* Display the number of chapters in the course. */}
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {/* Conditionally render course progress or price. */}
          {progress !== null ? (
            /* Display course progress with a success variant if completed. */
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : (
            /* Display the course price. */
            <p className="text-md md:text-sm font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}