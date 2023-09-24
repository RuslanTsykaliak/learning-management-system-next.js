import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client"

// Define the input interface for the getChapter function
interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

// Define the getChapter function that fetches chapter-related data
export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    // Retrieve the purchase record for the user and course combination
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        }
      }
    })

    // Retrieve course information if it is published
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      }
    })

    // Retrieve chapter information if it is published
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      }
    })

    // Check if the chapter or course is not found; throw an error if either is missing
    if (!chapter || !course) {
      throw new Error("Chapter or course not found")
    }

    // Initialize variables for Mux data, attachments, and the next chapter
    let muxData = null
    let attachments: Attachment[] = []
    let nextChapter: Chapter | null = null
    
    // If a purchase exists for the user, fetch attachments related to the course
    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId
        }
      })
    }

    // If the chapter is free or has been purchased, fetch Mux data and the next chapter
    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
        }
      })

      // Find the next chapter in the course based on position
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          }
        },
        orderBy: {
          position: 'asc',
        }
      })
    }

    // Retrieve user progress for the chapter
    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        }
      }
    })

    // Return the collected chapter-related data
    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    }
  } catch (error) {
    // Handle any errors and log them
    console.log("[GET_CHAPTER]", error)
    
    // Return default values if there was an error
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    }
  }
}
