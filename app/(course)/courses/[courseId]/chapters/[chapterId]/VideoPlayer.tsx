'use client'

import axios from 'axios'
import MuxPlayer from '@mux/mux-player-react'
import { useState } from 'react'
import { toast } from "react-hot-toast"
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useConfettiStore } from "@/hooks/"

// Define the props for the VideoPlayer component
interface VideoPlayerProps {
  playbackId: string; // The unique ID of the video to play
  courseId: string; // The ID of the course that the video belongs to
  chapterId: string; // The ID of the chapter that the video belongs to
  nextChapterId?: string; // The ID of the next chapter in the course (optional)
  isLocked: boolean; // Whether or not the chapter is locked
  completeOnEnd: boolean; // Whether or not to update the user's progress for the chapter when the video ends
  title: string; // The title of the video
}

// Define the VideoPlayer component
export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  // State to track whether the video is ready to play
  const [isReady, setIsReady] = useState(false);

  // next/navigation
  const router = useRouter();

  // Custom hook for confetti animation
  const confetti = useConfettiStore();

  // Function to be called when the video ends
  const onEnd = async () => {
    try {
      // If completeOnEnd is true, update the user's progress for the chapter
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });

        // If there's no next chapter, trigger confetti animation
        if (!nextChapterId) {
          confetti.onOpen();
        }

        // Show a success toast notification and refresh the router
        toast.success("Progress updated");
        router.refresh();

        // If there's a next chapter, navigate to it
        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch (error) {
      // Show an error toast if something goes wrong
      toast.error("Something went wrong");
    }
  };

  // Render the VideoPlayer component
  return (
    <div className='relative aspect-video'>
      {/* Loading spinner while video is not ready */}
      {!isReady && !isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800'>
          <Loader2 className='h-8 w-8 animate-spin text-secondary' />
        </div>
      )}

      {/* Display a locked message if the chapter is locked */}
      {isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary'>
          <Lock className='h-8 w-8' />
          <p className='text-sm'>
            This chapter is locked
          </p>
        </div>
      )}

      {/* Render the video player if it's not locked and is ready */}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(
            !isReady && 'hidden'
          )}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
}
