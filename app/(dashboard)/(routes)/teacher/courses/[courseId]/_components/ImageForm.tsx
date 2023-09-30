'use client'

import * as z from 'zod'
import axios from 'axios'
import { Pencil, PlusCircle, ImageIcon } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/FileUpload'

// Define the props interface for the ImageForm component, including initial data and courseId.
interface ImageFormProps {
  initialData: Course; // Course data to initialize the form
  courseId: string;    // The ID of the course
};

// Define the form schema using the `zod` library, specifying validation rules for imageUrl.
const formSchema = z.object({
  imageUrl: z.string().min(1, { // Validate that imageUrl is a non-empty string
    message: "Image is required",
  }),
});

// Create the ImageForm component, which allows users to edit course images.
export const ImageForm = ({
  initialData,   // Initial course data
  courseId       // ID of the course
}: ImageFormProps) => {
  // State to track whether the form is in editing mode or not
  const [isEditing, setIsEditing] = useState(false);

  // Function to toggle the editing mode
  const toggleEdit = () => setIsEditing((current) => !current);

  // Access the Next.js router
  const router = useRouter();

  // Handle form submission when the user updates the image
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Send a patch request to update the course image
      await axios.patch(`/api/courses/${courseId}`, values);
      // Display a success toast message
      toast.success("Course updated");
      // Exit the editing mode
      toggleEdit();
      // Refresh the router to reflect the changes
      router.refresh();
    } catch {
      // Display an error toast message if something goes wrong
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.imageUrl ? (
          // Display a placeholder image when not in editing mode and no image exists
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          // Display the course image when not in editing mode and an image exists
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        )
      )}
      {isEditing && (
        // Render the form for image upload when in editing mode
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                // Call the onSubmit function with the new image URL
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  )
}
