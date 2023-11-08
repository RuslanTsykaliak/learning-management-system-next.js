'use client'

import * as z from 'zod'
import axios from 'axios'
import MuxPlayer from '@mux/mux-player-react'
import { Pencil, PlusCircle, Video } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { Chapter, MuxData } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/FileUpload'

// Define a component called ChapterVideoForm with props of ChapterVideoFormProps.

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null }; // Props include initial data for a chapter and optional MuxData.
  courseId: string; // The ID of the course to which the chapter belongs.
  chapterId: string; // The ID of the chapter being edited.
}

// Define a schema for form validation.
const formSchema = z.object({
  videoUrl: z.string().min(1), // Validate the video URL field.
})

// Define the ChapterVideoForm component.
export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false); // State for toggling edit mode.

  const toggleEdit = () => setIsEditing((current) => !current); // Function to toggle edit mode.

  const router = useRouter(); // Get the Next.js router.

  // Function to handle form submission.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values); // Send a PATCH request to update the chapter.
      toast.success('Chapter updated'); // Display a success toast.
      toggleEdit(); // Exit edit mode.
      router.refresh(); // Refresh the router to reflect changes.
    } catch {
      toast.error('Something went wrong'); // Display an error toast if an error occurs.
    }
  }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p4'>
      <div className='font-medium flex items-center justify between'>
        Chapter video
        {/* Button to toggle the edit mode */}
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        // Check if not in edit mode and no initial video data
        !initialData.videoUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <Video className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <MuxPlayer
              playbackId={initialData?.muxData?.playbackId || ""}
            />
          </div>
        )
      )}
      {isEditing && (
        // Render file upload and description in edit mode
        <div>
          <FileUpload
            endpoint='chapterVideo'
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            Upload the video for this chapter
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        // Display a message when video processing is required
        <div className='text-xs text-muted-foreground mt-2'>
          Videos can take a few minutes to process. Refresh the page if the video does not appear.
        </div>
      )}
    </div>
  )
}
