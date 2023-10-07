"use client";

import ReactConfetti from "react-confetti";

import { useConfettiStore } from "@/hooks/useConfettiStore";

// Create the ConfettiProvider component.
export const ConfettiProvider = () => {
  // Use a custom hook (useConfettiStore) to access confetti-related state and functions.
  const confetti = useConfettiStore();

  // If the confetti animation is not triggered (isOpen is false), return null.
  if (!confetti.isOpen) return null;

  // Render a ReactConfetti component to display the confetti animation.
  return (
    <ReactConfetti
      className="pointer-events-none z-[100]"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => {
        // When the confetti animation is complete, call the onClose function from the confetti state.
        confetti.onClose();
      }}
    />
  );
}
