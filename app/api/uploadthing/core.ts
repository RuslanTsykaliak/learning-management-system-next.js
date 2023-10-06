import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { isTeacher } from "@/lib/teacher";

// Create an instance of the Uploadthing library and assign it to the variable 'f'.
const f = createUploadthing();

// Define a function 'handleAuth' for handling user authentication and authorization.
const handleAuth = () => {
  // Extract the 'userId' from the authentication context.
  const { userId } = auth();

  // Check if the user is authorized as a teacher.
  const isAuthorized = isTeacher(userId);

  // If the user is not authenticated or not authorized, throw an error indicating "Unauthorized".
  if (!userId || !isAuthorized) throw new Error("Unauthorized");

  // Return an object containing the 'userId'.
  return { userId };
}

// Define 'ourFileRouter' as an object with different file upload configurations.
export const ourFileRouter = {
  // Configure file upload for course images with specific constraints.
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Apply middleware to handle user authentication and authorization.
    .middleware(() => handleAuth())
    // Define an empty callback function for upload completion.
    .onUploadComplete(() => {}),
  
  // Configure file upload for course attachments of various types.
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    // Apply middleware to handle user authentication and authorization.
    .middleware(() => handleAuth())
    // Define an empty callback function for upload completion.
    .onUploadComplete(() => {}),
  
  // Configure file upload for chapter videos with specific constraints.
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    // Apply middleware to handle user authentication and authorization.
    .middleware(() => handleAuth())
    // Define an empty callback function for upload completion.
    .onUploadComplete(() => {})
} satisfies FileRouter;

// Define the type 'OurFileRouter' as the type of 'ourFileRouter'.
export type OurFileRouter = typeof ourFileRouter;
