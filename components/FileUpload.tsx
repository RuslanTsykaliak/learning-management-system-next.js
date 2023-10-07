"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

// Define the props expected by the FileUpload component.
interface FileUploadProps {
  onChange: (url?: string) => void; // A function to be called when the upload is completed.
  endpoint: keyof typeof ourFileRouter; // The endpoint for the file upload, derived from ourFileRouter.
}

export const FileUpload = ({
  onChange, // Function to handle the upload completion.
  endpoint // Endpoint for the file upload.
}: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint} // Pass the specified endpoint to the UploadDropzone component.
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url); // Call the onChange function with the uploaded file URL.
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`); // Display an error toast message if there's an upload error.
      }}
    />
  );
}
