'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
};

// Define a form schema using the `zod` library to validate the description field.
const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

// DescriptionForm component receives initial data and courseId as props.
export const DescriptionForm = ({
  initialData,
  courseId
}: DescriptionFormProps) => {
  // State to control whether the description is in editing mode.
  const [isEditing, setIsEditing] = useState(false);

  // Function to toggle the edit mode.
  const toggleEdit = () => setIsEditing((current) => !current);

  // Next.js router instance for navigation.
  const router = useRouter();

  // Initialize a form using the zod schema and default values.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || ""
    },
  });

  // Extract formState properties for convenience.
  const { isSubmitting, isValid } = form.formState;

  // Function to handle form submission.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Make a PATCH request to update the course description.
      await axios.patch(`/api/courses/${courseId}`, values);
      // Display a success toast notification.
      toast.success("Course updated");
      // Toggle off the edit mode.
      toggleEdit();
      // Refresh the router to update the page.
      router.refresh();
    } catch {
      // Display an error toast in case of an error.
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify between">
        Course description
        {/* Button to toggle the edit mode */}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn(
          "text-sm mt-2",
          !initialData.description && "text-slate-500 italic"
        )}>
          {/* Display the course description or a message if it's empty */}
          {initialData.description || "No description"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              // Render the form field using Formik components.
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'This course is about...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              {/* Button to save the updated description */}
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
