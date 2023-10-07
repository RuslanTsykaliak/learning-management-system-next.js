"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define the 'ConfirmModalProps' interface to specify the expected props for the 'ConfirmModal' component.
interface ConfirmModalProps {
  children: React.ReactNode;   // Content to trigger the modal (e.g., a button or link)
  onConfirm: () => void;       // Callback function to be executed when confirming the action
}

// Define the 'ConfirmModal' React component.
export const ConfirmModal = ({
  children,       // Content that triggers the modal
  onConfirm       // Callback function to be executed on confirmation
}: ConfirmModalProps) => {
  return (
    // Create an AlertDialog component (a modal dialog)
    <AlertDialog>
      {/* Create an AlertDialogTrigger component to trigger the modal */}
      <AlertDialogTrigger asChild>
        {children}   {/* Render the 'children' content here to trigger the modal */}
      </AlertDialogTrigger>
      {/* Define the content of the modal */}
      <AlertDialogContent>
        {/* Modal header */}
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* Modal footer */}
        <AlertDialogFooter>
          {/* Cancel button */}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* Continue button with an 'onClick' event to execute 'onConfirm' callback */}
          <AlertDialogAction onClick={onConfirm}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
