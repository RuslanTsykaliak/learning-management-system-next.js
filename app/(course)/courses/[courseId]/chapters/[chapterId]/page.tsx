import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/getChapter";
import { Banner } from "@/components/Banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/Preview";

import { VideoPlayer } from "./_components/VideoPlayer";
import { CourseEnrollButton } from "./_components/CourseEnrollButton";
import { CourseProgressButton } from "./_components/CourseProgressButton";

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {
  // Get the user's ID from authentication.
  const { userId } = auth();
  
  // If the user is not authenticated, redirect them to the homepage.
  if (!userId) {
    return redirect("/");
  } 

  // Retrieve chapter and course information, as well as related data.
  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  // If the chapter or course doesn't exist, redirect to the homepage.
  if (!chapter || !course) {
    return redirect("/")
  }

  // Determine if the chapter is locked and whether to mark it as complete.
  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted; // The !! operator in TypeScript is a unary operator that converts its operand to a boolean value. If the operand is a boolean value, the !! operator returns that value unchanged. If the operand is any other type, the !! operator returns true if the operand is truthy and false if the operand is falsy.

  return ( 
    <div>
      {userProgress?.isCompleted && (
        // Display a banner indicating that the chapter is already completed.
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
        // Display a banner indicating that the chapter is locked and requires a purchase.
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!} // The ! operator at the end of the line is a non-null assertion operator. It tells TypeScript that the muxData?.playbackId property is definitely not null or undefined, even though it is optional.
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            {purchase ? (
              // If the user purchased the course, display the course progress button.
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              // If the user hasn't purchased the course, display the course enroll button.
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            {/* Display a preview of the chapter's description. */}
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  // Display attachments as links to open in a new tab.
                  <a 
                    href={attachment.url}
                    target="_blank" // open in a new tab or window
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">
                      {attachment.name}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
   );
}
 
export default ChapterIdPage;
