import { create } from "zustand";

// Define a type called ConfettiStore to represent the shape of the confetti store.
type ConfettiStore = {
  isOpen: boolean; // A boolean indicating whether the confetti is open or not.
  onOpen: () => void; // A function to open the confetti.
  onClose: () => void; // A function to close the confetti.
};

// Export a custom hook called useConfettiStore that creates and manages the confetti store.
export const useConfettiStore = create<ConfettiStore>((set) => ({
  isOpen: false, // Initialize isOpen as false, indicating the confetti is initially closed.
  onOpen: () => set({ isOpen: true }), // Define onOpen function to set isOpen to true, opening the confetti.
  onClose: () => set({ isOpen: false }), // Define onClose function to set isOpen to false, closing the confetti.
}));
