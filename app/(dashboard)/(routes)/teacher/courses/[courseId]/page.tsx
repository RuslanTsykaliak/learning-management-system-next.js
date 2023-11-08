import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/IconBadge";
import { Banner } from "@/components/Banner";

import { TitleForm } from "./_components/TitleForm"
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/ImageForm";
import { CategoryForm } from "./_components/CategoryForm";
import { PriceForm } from "./_components/PriceForm";
import { AttachmentForm } from "./_components/AttachmentForm";
import { ChaptersForm } from "./_components/ChaptersForm";
import { Actions } from "./_components/Actions";

// Define a Next.js page component for handling a specific course's page.
const CourseIdPage = async ({
  params
}: {
  params: { courseId: string }
}) => {
  // Get the user's ID from the authentication system
  const { userId } = auth();

  // If the user is not authenticated, redirect them to the homepage
  if (!userId) {
    return redirect('/');
  }

  // Fetch information about the course, including chapters and attachments
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc',
        },
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  // Fetch all categories
  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  // If the course doesn't exist, redirect the user to the homepage
  if (!course) {
    return redirect('/');
  }

  // Define an array of required fields and calculate the completion status
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  // Create a new array to only include required fields that are true
  const completedFields = requiredFields.filter(Boolean).length;

  // Generate completion text based on completed and total fields
  const completionText = `(${completedFields}/${totalFields})`;

  // Determine if all required fields are completed
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {/* Display a banner if the course is unpublished */}
      {!course.isPublished && (
        <Banner
          label='This course is unpublished. It will not be visible to the students.'
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Course setup
            </h1>
            {/* Display completion status */}
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          {/* Render Actions component */}
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">
                Customize your course
              </h2>
            </div>
            {/* Render TitleForm, DescriptionForm, ImageForm, and CategoryForm components */}
            <TitleForm
              initialData={course}
              courseId={course.id}
            />
            <DescriptionForm
              initialData={course}
              courseId={course.id}
            />
            <ImageForm
              initialData={course}
              courseId={course.id}
            />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">
                  Course chapters
                </h2>
              </div>
              {/* Render ChaptersForm component */}
              <ChaptersForm
                initialData={course}
                courseId={course.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">
                  Sell your course
                </h2>
              </div>
              {/* Render PriceForm component */}
              <PriceForm
                initialData={course}
                courseId={course.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">
                  Resources & Attachments
                </h2>
              </div>
              {/* Render AttachmentForm component */}
              <AttachmentForm
                initialData={course}
                courseId={course.id}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseIdPage;
