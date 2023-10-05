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
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Editor } from '@/components/editor'
import { Preview } from '@/components/preview'

// Define an interface for the ChapterDescriptionFormProps.
interface ChapterDescriptionFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

// Define a schema for form validation.
const formSchema = z.object({
  description: z.string().min(1),
})

// Define the ChapterDescriptionForm component.
export const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false); // State for toggling edit mode.

  const toggleEdit = () => setIsEditing((current) => !current); // Function to toggle edit mode.

  const router = useRouter(); // Get the Next.js router.

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || ""
    },
  })

  const { isSubmitting, isValid } = form.formState; // Get form state properties.

  // Function to handle form submission.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values); // Send a PATCH request to update the chapter description.
      toast.success('Chapter updated successfully'); // Display a success toast.
      toggleEdit(); // Exit edit mode.
      router.refresh(); // Refresh the router to reflect changes.
    } catch {
      toast.error('Something went wrong'); // Display an error toast if an error occurs.
    }
  }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Chapter description
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className={cn(
          'text-sm mt-2',
          !initialData.description && 'text-slate-500 italic'
        )}>
          {!initialData.description && 'No description'}
          {initialData.description && (
            <Preview
              value={initialData.description}
            />
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
