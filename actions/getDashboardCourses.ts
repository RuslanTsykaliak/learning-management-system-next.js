import { Chapter, Category, Course } from '@prisma/client';

import { db } from '@/lib/db'
import { getProgress } from '@/actions/getProgress'

// This code exports a function `getDashboardCourses` that fetches and processes courses for a user's dashboard.
// It takes a userId as input and returns a promise with an object containing completedCourses and coursesInProgress.

// Define a custom type `CourseWithProgressWithCategory` that extends the Course type with additional properties.
type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

// Define the structure of the DashboardCourses object.
type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
}

// Export the `getDashboardCourses` function as an asynchronous function.
export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
  try {
    // Fetch purchased courses for the user from the database.
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              }
            }
          }
        }
      }
    });

    // Extract the courses and cast them to CourseWithProgressWithCategory type.
    const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

    // Calculate and assign progress for each course.
    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    // Separate courses into completed and in-progress based on progress percentage.
    const completedCourses = courses.filter((course) => course.progress === 100);
    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourses,
      coursesInProgress,
    }
  } catch (error) {
    // Handle errors and log them, returning empty arrays as a fallback.
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    }
  }
}
