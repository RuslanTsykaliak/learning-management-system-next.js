'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Define the 'TitleFormProps' interface to specify the expected props for the 'TitleForm' component.
interface TitleFormProps {
  // Initial data, including the course title.
  initialData: {
    title: string;
  };
  // The unique identifier of the course.
  courseId: string;
}

// Define a validation schema for the course title using the 'zod' library.
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
})

// Define the 'TitleForm' React component.
export const TitleForm = ({
  initialData,
  courseId,
}: TitleFormProps) => {
  // State variable to track whether the form is in edit mode.
  const [isEditing, setIsEditing] = useState(false)

  // Function to toggle between edit and non-edit mode.
  const toggleEdit = () => setIsEditing((current) => !current)

  // Access the 'router' for navigation within the application.
  const router = useRouter()

  // Create a form instance with 'zod' schema validation and default values.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  // Extract form state properties.
  const { isSubmitting, isValid } = form.formState

  // Function to handle form submission.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Send a PATCH request to update the course title.
      await axios.patch(`/api/courses/${courseId}`, values)
      // Display a success message using a toast notification.
      toast.success('Course updated successfully')
      // Exit edit mode.
      toggleEdit()
      // Refresh the router to reflect the changes.
      router.refresh()
    } catch {
      // Handle errors and display an error message.
      toast.error('Something went wrong')
    }
  }

  // Render the form based on whether it's in edit mode or not.
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course title
        {/* Button to toggle between edit and non-edit mode */}
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit title
            </>
          )}
        </Button>
      </div>
      {/* Display the course title when not in edit mode */}
      {!isEditing && (
        <p className='text-sm mt-2'>
          {initialData.title}
        </p>
      )}
      {/* Display the form for editing when in edit mode */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            {/* Form field for entering and validating the course title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Button to save changes when the form is valid */}
            <div className='flex items-center gap-x-2'>
              <Button
                disabled={!isValid || isSubmitting}
                type='submit'
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
