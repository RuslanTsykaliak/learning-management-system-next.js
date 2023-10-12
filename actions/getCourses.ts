import { Category, Course } from '@prisma/client'

import { getProgress } from '@/actions/getProgress'
import { db } from '@/lib/db'

// Exports a function `getCourses` that fetches and processes a list of courses with additional information.
// It takes an object with parameters userId, title, and categoryId and returns a promise with an array of CourseWithProgressWithCategory objects.

// Define a custom type `CourseWithProgressWithCategory` that extends the Course type with additional properties.
type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
}

// Define the input parameters for the `getCourses` function.
type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
}

// Export the `getCourses` function as an asynchronous function.
export const getCourses = async ({
  userId,
  title,
  categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    // Fetch courses from the database based on specified criteria.
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          }
        },
        purchases: {
          where: {
            userId,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Process and enrich the course data.
    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async course => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }

        const progressPercentage = await getProgress(userId, course.id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    // Handle errors and log them.
    console.log('[GET_COURSES]', error);
    return [];
  }
}
