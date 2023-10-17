'use client'

import * as z from 'zod'
import axios from 'axios'
import { Pencil, PlusCircle, ImageIcon, File, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Attachment, Course } from '@prisma/client'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/FileUpload'

// This interface defines the props that are passed to the AttachmentForm component.
interface AttachmentFormProps {
  // The initial data for the form.
  initialData: Course & { attachments: Attachment[] };
  // The ID of the course.
  courseId: string;
}

// This object defines the schema for the form.
const formSchema = z.object({
  // The URL of the attachment.
  url: z.string().min(1),
});

// This function defines the AttachmentForm component. It takes in an AttachmentFormProps object as its prop and returns a JSX element.
export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  // State to track whether the form is in editing mode.
  const [isEditing, setIsEditing] = useState(false);
  // State to track the ID of the attachment that is being deleted.
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Function to toggle the editing mode of the form.
  const toggleEdit = () => setIsEditing((current) => !current);

  // Get the router object.
  const router = useRouter();

  // Function to be called when the form is submitted.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Post the attachment URL to the API.
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      // Show a success toast notification and refresh the router.
      toast.success('Attachment deleted successfully');
      router.refresh();
    } catch (error) {
      // Show an error toast notification.
      toast.error('Something went wrong');
    } finally {
      // Set the deletingId state back to null.
      setDeletingId(null);
    }
  };

  // The following JSX code defines a component that displays a list of course attachments.

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</> // Display 'Cancel' when isEditing is true
          )}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" /> {/* Display a plus icon */}
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" /> {/* Display a file icon */}
                  <p className="text-xs line-clamp-1">
                    {attachment.name}
                  </p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" /> {/* Display a loading spinner when deleting */}
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" /> {/* Display a delete (X) icon */}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  )
}