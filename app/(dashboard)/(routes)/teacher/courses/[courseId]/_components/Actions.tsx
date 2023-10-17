'use client'

import axios from "axios"
import { Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ConfirmModal } from '@/components/modals/ConfirmModal'
import { useConfettiStore } from '@/hooks/useConfettiStore'

// This interface defines the props that are passed to the Actions component.
interface ActionsProps {
  // Whether or not the actions are disabled.
  disabled: boolean;
  // The ID of the course.
  courseId: string;
  // Whether or not the course is published.
  isPublished: boolean;
}

// This function defines the Actions component. It takes in an ActionsProps object as its prop and returns a JSX element.
export const Actions = ({
  disabled,
  courseId,
  isPublished
}: ActionsProps) => {
  // Get the router object.
  const router = useRouter();
  // Get the confetti store.
  const confetti = useConfettiStore();
  // State to track whether the actions are loading.
  const [isLoading, setIsLoading] = useState(false);

  // Function to be called when the user clicks on the publish/unpublish button.
  const onClick = async () => {
    try {
      // Set the isLoading state to true to indicate that the actions are loading.
      setIsLoading(true);

      // If the course is published, unpublish it. Otherwise, publish it.
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Course unpublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course published");
        confetti.onOpen();
      }

      // Refresh the router to update the page.
      router.refresh();
    } catch (error) {
      // Show an error toast notification if something goes wrong.
      toast.error("Something went wrong");
    } finally {
      // Set the isLoading state to false to indicate that the actions are no longer loading.
      setIsLoading(false);
    }
  };

  // Function to be called when the user clicks on the delete button.
  const onDelete = async () => {
    try {
      // Set the isLoading state to true to indicate that the actions are loading.
      setIsLoading(true);

      // Delete the course.
      await axios.delete(`/api/courses/${courseId}`);

      // Show a success toast notification and refresh the router.
      toast.success("Course deleted");
      router.refresh();
      router.push(`/teacher/courses`);
    } catch (error) {
      // Show an error toast notification if something goes wrong.
      toast.error("Something went wrong");
    } finally {
      // Set the isLoading state to false to indicate that the actions are no longer loading.
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick} // Handle click event for toggling publication
        disabled={disabled || isLoading} // Disable the button if requested or while loading
        variant='outline' // Use an outlined button style
        size='sm' // Set the button size to small
      >
        {isPublished ? 'Unpublished' : 'Published'} {/* Display 'Published' or 'Unpublished' based on the value of isPublished */}
      </Button>
      <ConfirmModal onConfirm={onDelete}> {/* Display a confirmation modal on button click with onDelete as the confirmation action */}
        <Button size='sm' disabled={isLoading}> {/* Create a small button for triggering the modal */}
          <Trash className="h-4 w-4" /> {/* Display a trash can icon */}
        </Button>
      </ConfirmModal>
    </div>
  )
}