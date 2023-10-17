import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string; }
}) => {
  // Fetch course details, including published chapters
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc" // order the chapters by their position property in ascending order. 
        }
      }
    }
  });

  if (!course) {
    // If the course is not found, redirect to the homepage
    return redirect("/");
  }

  // Redirect to the first chapter of the course
  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}

export default CourseIdPage;
