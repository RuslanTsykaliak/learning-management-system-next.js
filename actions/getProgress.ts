import { db } from '@/lib/db';


// Calculates the user's progress on the course as a percentage
export const getProgress = async (
  userId: string,
  courseId: string,
) : Promise<number> => { // the promise will resolve a number
  try {
    // Gets all of the published chapters for the course
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      }
    })

    // Creates an array of the IDs of the published chapters
    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id)

    // Gets the number of completed chapters that the user has for the course
    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      }
    })

    // Calculates the user's progress by dividing the number of completed chapters by the total number of published chapters and multiplying by 100
    const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100
    
    return progressPercentage
  } catch (error) {
    console.log("[GET_PROGRESS]", error)
    return 0
  }
}