'use client'

import axios from "axios"
import { Trash } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { ConfirmModal } from '@/components/modals/ConfirmModal'

// Define an interface for the ChapterActionsProps.
interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

// Define the ChapterActions component.
export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter(); // Get the Next.js router.
  const [isLoading, setIsLoading] = useState(false); // State for tracking loading status.

  // Function to handle the publish/unpublish button click.
  const onClick = async () => {
    try {
      setIsLoading(true); // Set loading state to true.

      if (isPublished) {
        // If the chapter is published, send a PATCH request to unpublish it.
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
        toast.success('Chapter unpublished'); // Display a success toast.
      } else {
        // If the chapter is not published, send a PATCH request to publish it.
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
        toast.success('Chapter published'); // Display a success toast.
      }

      router.refresh(); // Refresh the router to reflect changes.
    } catch {
      toast.error('Something went wrong'); // Display an error toast if an error occurs.
    } finally {
      setIsLoading(false); // Set loading state back to false.
    }
  }

  // Function to handle the delete button click.
  const onDelete = async () => {
    try {
      setIsLoading(true); // Set loading state to true.

      // Send a DELETE request to delete the chapter.
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success('Chapter deleted'); // Display a success toast.
      router.refresh(); // Refresh the router to reflect changes.
      router.push(`/teacher/courses/${courseId}`); // Navigate back to the course page.
    } catch {
      toast.error('Something went wrong'); // Display an error toast if an error occurs.
    } finally {
      setIsLoading(false); // Set loading state back to false.
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      {/* Publish/Unpublish button */}
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant='outline'
        size='sm'
      >
        {/* Display "Publish" or "Unpublish" based on the 'isPublished' status */}
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      {/* Delete button with a confirmation modal */}
      <ConfirmModal onConfirm={onDelete}>
        <Button size='sm' disabled={isLoading}>
          {/* Trash icon for deleting */}
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
