'use client'

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
})

const CreatePage = () => {
  const router = useRouter()
  // The useForm hook takes a configuration object as its argument and returns a form object.
  // formSchema is an object that defines the validation rules for the form fields.
  // The infer function takes the type of a Zod schema as its argument and returns the type of the data the schema validates.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Send a POST request to create a new course with the provided values.
      const response = await axios.post('/api/courses', values)
      // Navigate to the page of the newly created course.
      router.push(`/teacher/courses/${response.data.id}`)
      // Display a success toast message.
      toast.success('Course created')
    } catch {
      // Display an error toast message if something goes wrong.
      toast.error('Something went wrong')
    }
  }

  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
      <div>
        <h1 className='text-2xl'>
          Name your course
        </h1>
        <p className='text-sm text-slate-600'>
          What would you like to name your course? Don&apos;t worry, you can change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 mt-8'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Course title
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Link href='/'>
                <Button
                  type='button'
                  variant='ghost'
                >
                  Cancel
                </Button>
              </Link>
              {/* The || (OR) operator will always return the first true value if either of its operands is true,
                 or it will return false if both operands are falsy. */}
              <Button
                type='submit'
                disabled={!isValid || isSubmitting}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreatePage