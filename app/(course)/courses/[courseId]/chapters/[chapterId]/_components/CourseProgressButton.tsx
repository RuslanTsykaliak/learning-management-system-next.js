'use client'

import axios from "axios"
import { CheckCircle, XCircle } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useState } from "react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/useConfettiStore" 

// Define the props for the CourseProgressButton component
interface CourseProgressButtonProps {
  chapterId: string; // The ID of the chapter to mark as complete or incomplete
  courseId: string; // The ID of the course that the chapter belongs to
  isCompleted?: boolean; // Whether or not the chapter is currently completed (optional)
  nextChapterId?: string; // The ID of the next chapter in the course (optional)
}

// Define the CourseProgressButton component
export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId
}: CourseProgressButtonProps) => {

  // Next.js navigation
  const router = useRouter();

  // Custom hook for confetti animation
  const confetti = useConfettiStore();

  // State to track whether the button is loading
  const [isLoading, setIsLoading] = useState(false);

  // Click handler for the button
  const onClick = async () => {
    try {
      // Set the isLoading state to true
      setIsLoading(true);

      // Update the user's progress for the chapter
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted
      });

      // If the chapter is now completed and there is no next chapter, trigger the confetti animation
      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      // If the chapter is now completed and there is a next chapter, navigate to the next chapter
      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      // Show a success toast notification and refresh the router
      toast.success("Progress updated");
      router.refresh();
    } catch {
      // Show an error toast if something goes wrong
      toast.error("Something went wrong");
    } finally {
      // Set the isLoading state to false
      setIsLoading(false);
    }
  }

  // Determine the icon to display based on the completion status of the chapter
  const Icon = isCompleted ? XCircle : CheckCircle

  // Render the CourseProgressButton component
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      // Set the button variant based on whether the chapter is completed or not
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      {/* Display different labels based on the chapter's completion status */}
      {isCompleted ? "Not completed" : "Mark as complete"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  )
  
}