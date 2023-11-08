'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Chapter } from '@prisma/client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Editor } from '@/components/Editor'
import { Preview } from '@/components/Preview'
import { Checkbox } from '@/components/ui/checkbox'

// Define the 'ChapterAccessFormProps' interface to specify the expected props for the 'ChapterAccessForm' component.
interface ChapterAccessFormProps {
  // Initial data, including the chapter details.
  initialData: Chapter;
  // The unique identifier of the course to which the chapter belongs.
  courseId: string;
  // The unique identifier of the chapter being edited.
  chapterId: string;
}

// Define a validation schema for the chapter access settings using the 'zod' library.
const formSchema = z.object({
  isFree: z.boolean().default(false),
});

// Define the 'ChapterAccessForm' React component.
export const ChapterAccessForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) => {
  // State variable to track whether the form is in edit mode.
  const [isEditing, setIsEditing] = useState(false)

  // Function to toggle between edit and non-edit mode.
  const toggleEdit = () => setIsEditing((current) => !current)

  // Access the 'router' for navigation within the application.
  const router = useRouter()

  // Create a form instance with 'zod' schema validation and default values.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData.isFree
    },
  })

  // Extract form state properties.
  const { isSubmitting, isValid } = form.formState

  // Function to handle form submission.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Send a PATCH request to update the chapter access settings.
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
      // Display a success message using a toast notification.
      toast.success('Chapter updated successfully')
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
        Chapter access
        {/* Button to toggle between edit and non-edit mode */}
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit access
            </>
          )}
        </Button>
      </div>
      {/* Display the chapter's access status when not in edit mode */}
      {!isEditing && (
        <p className={cn(
          'text-sm mt-2',
          !initialData.isFree && 'text-slate-500 italic'
        )}>
          {initialData.isFree ? (
            <>This chapter is free for preview.</>
          ) : (
            <>This chapter is not free.</>
          )}
        </p>
      )}
      {/* Display the form for editing when in edit mode */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            {/* Form field for toggling chapter access */}
            <FormField
              control={form.control}
              name='isFree'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormDescription>
                      Check this box if you want to make this chapter free for preview
                    </FormDescription>
                  </div>
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
