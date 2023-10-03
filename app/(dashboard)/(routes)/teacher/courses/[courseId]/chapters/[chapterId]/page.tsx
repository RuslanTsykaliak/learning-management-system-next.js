import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from '@/components/IconBadge'
import { Banner } from '@/components/banner'

import { ChapterTitleForm } from "./_components/chapterTitleForm";
import { ChapterDescriptionForm } from "./_components/chapterDescriptionForm";
import { ChapterAccessForm } from "./_components/chapterAccessForm";
import { ChapterVideoForm } from "./_components/chapterVideoForm";
import { ChapterActions } from "./_components/chapterActions";

// Define a Next.js page component for handling a specific chapter's page.
const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {
  // Get the user's ID from the authentication system
  const { userId } = auth();

  // If the user is not authenticated, redirect them to the homepage
  if (!userId) {
    return redirect('/');
  }

  // Fetch information about the chapter including muxData
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId
    },
    include: {
      muxData: true,
    },
  });

  // If the chapter doesn't exist, redirect the user to the homepage
  if (!chapter) {
    return redirect('/');
  }

  // Define an array of required fields and calculate the completion status
  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  // Generate completion text based on completed and total fields
  const completionText = `(${completedFields}/${totalFields})`;

  // Determine if all required fields are completed
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {/* Display a warning banner if the chapter is unpublished */}
      {!chapter.isPublished && (
        <Banner
          variant='warning'
          label='This chapter is unpublished. It will not be visible in the course'
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            {/* Provide a link to navigate back to the course setup */}
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">
                  Chapter Creation
                </h1>
                {/* Display completion status */}
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              {/* Render ChapterActions component */}
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={params.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">
                  Customize your chapter
                </h2>
              </div>
              {/* Render ChapterTitleForm and ChapterDescriptionForm components */}
              <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye}/>
                <h2 className="text-xl">
                  Access Settings
                </h2>
              </div>
              {/* Render ChapterAccessForm component */}
              <ChapterAccessForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">
                Add a video
              </h2>
            </div>
            {/* Render ChapterVideoForm component */}
            <ChapterVideoForm
              initialData={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChapterIdPage;
