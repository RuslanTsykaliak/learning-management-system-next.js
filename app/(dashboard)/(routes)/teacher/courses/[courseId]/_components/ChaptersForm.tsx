'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, Course } from '@prisma/client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

import { ChaptersList } from "./ChaptersList"

// This interface defines the props that are passed to the ChaptersForm component.
interface ChaptersFormProps {
  // The initial data for the form.
  initialData: Course & { chapters: Chapter[] };
  // The ID of the course.
  courseId: string;
}

// This object defines the schema for the form.
const formSchema = z.object({
  // The title of the chapter.
  title: z.string().min(1),
});

// This function defines the ChaptersForm component. It takes in a ChaptersFormProps object as its prop and returns a JSX element.
export const ChaptersForm = ({
  initialData,
  courseId,
}: ChaptersFormProps) => {
  // State to track whether the user is creating a new chapter.
  const [isCreating, setIsCreating] = useState(false);
  // State to track whether the user is updating the chapters order.
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to toggle the creating state.
  const toggleCreating = () => setIsCreating((current) => !current);

  // Get the router object.
  const router = useRouter();

  // Use the `useForm` hook to create a form instance.
  const form = useForm<z.infer<typeof formSchema>>({
    // Use the `zodResolver` function to validate the form data using the `formSchema` object.
    resolver: zodResolver(formSchema),
    // Set the default values for the form data.
    defaultValues: {
      title: "",
    },
  });

  // Get the form state from the form instance.
  const { isSubmitting, isValid } = form.formState;

  // Function to be called when the form is submitted.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Post the new chapter to the API.
      await axios.post(`/api/courses/${courseId}/chapters`, values)
      toast.success('Chapter created successfully')
      toggleCreating()
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    }
  }

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true)

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData
      })
      // Show a success toast notification and refresh the router.
      toast.success('Chapters reordered');
      router.refresh();
    } catch (error) {
      // Show an error toast notification.
      toast.error('Something went wrong');
    } finally {
      // Set the updating state to false.
      setIsUpdating(false);
    }
  };

  // Function to be called when the edit button is clicked for a chapter.
  const onEdit = (id: string) => {
    // Push the edit chapter page to the router.
    router.push(`/teacher/courses/<span class="math-inline">\{courseId\}/chapters/</span>{id}`);
  };

  // Render the ChaptersForm component.
  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
      {/* Show a loader if the chapters order is being updated. */}
      {isUpdating && (
        <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
          <Loader2 className='animate-spin h-6 2-6 text-sky-700' />
        </div>
      )}

      {/* Header for the chapters form. */}
      <div className='font-medium flex items-center justify-between'>
        Course chapters
        <Button onClick={toggleCreating} variant='ghost'>
          {/* Show the appropriate button text depending on the creating state. */}
          {isCreating ? (
            <>Cancle</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!isValid || isSubmitting}
              type='submit'
            >
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.chapters.length && "text-slate-500 italic"
        )}>
          {!initialData.chapters.length && "No chapters"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className='text-xs text-muted-foreground mt-4'>
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  )
}