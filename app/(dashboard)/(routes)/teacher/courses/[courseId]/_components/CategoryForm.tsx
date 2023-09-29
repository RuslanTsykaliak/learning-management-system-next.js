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
  FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Combobox } from '@/components/ui/combobox'

// This interface defines the props that are passed to the CategoryForm component.
interface CategoryFormProps {
  // The initial data for the form.
  initialData: Course;
  // The ID of the course.
  courseId: string;
  // The list of category options.
  options: { label: string; value: string; }[];
}

// This object defines the schema for the form.
const formSchema = z.object({
  // The ID of the selected category.
  categoryId: z.string().min(1),
});

// This function defines the CategoryForm component. It takes in a CategoryFormProps object as its prop and returns a JSX element.
export const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  // State to track whether the form is in editing mode.
  const [isEditing, setIsEditing] = useState(false);

  // Function to toggle the editing mode of the form.
  const toggleEdit = () => setIsEditing((current) => !current);

  // Get the router object.
  const router = useRouter();

  // Use the `useForm` hook to create a form instance.
  const form = useForm<z.infer<typeof formSchema>>({
    // Use the `zodResolver` function to validate the form data using the `formSchema` object.
    resolver: zodResolver(formSchema),
    // Set the default values for the form data.
    defaultValues: {
      categoryId: initialData?.categotyId || "",
    },
  });

  // Get the form state from the form instance.
  const { isSubmitting, isValid } = form.formState;

  // Function to be called when the form is submitted. The z.infer function takes the type of a Zod schema as its argument and returns the type of the data the schema validates.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Patch the course data to the API with the new category ID.
      await axios.patch(`/api/courses/${courseId}`, values);

      // Show a success toast notification and refresh the router.
      toast.success('Course updated successfully');
      toggleEdit();
      router.refresh();
    } catch (error) {
      // Show an error toast notification.
      toast.error('Something went wrong');
    }
  };

  // Find the selected category option from the list of options. The find() method takes a callback function as its argument. The callback function is called for each element in the array, and the method return the first element for which the callback function returns true.
  const selectedOption = options.find((option) => option.value === initialData.categoryId);

  // Render the CategoryForm component.
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex itmes-center justify-between'>
        <Button onClick={toggleEdit} variant='ghost'>
          {isEditing ? (
            <>Cancel</>
            //  :  is the conditional operator, also knhow as the ternay operator. It takes three operands adn returns the value of the second operand if the first operand is true, and the value of the third operand if the first operand is false.
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        // cn() function is a helper function that takes a variable number of arguments and returns a string containing the CSS classes that are passed to it.
        // && operator is returns true if both of its operands are true, and flase otherwise.
        <p className={cn(
          'text-sm mt-2',
          !initialData.categoryId && "text-slate-500 italic"
        )}>
          {selectedOption?.label || "No category"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 mt-4'
          >
            <FormField
              control={form.control}
              name='categoryId'
              // The render function can be used to render any type of form control, such as text input, a checkbox, or a dropdown.
              render={({ filed }) => ( 
                <FormItem>
                  <FormControl>
                    <Combobox
                    // The list of options to display in the dropdown, ... make it into one array.
                      options={...options} 
                      {...filed}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            >
              <div className='flex items-center gap-x-2'>
                <Button
                //  If form data is not valid or if the form is currently, submitting, the submit button should be disabled to prevent the user form submitting invalid data or from submitting the same data multiple times. ||: This is the logical OR operator. 
                  disabled={!isValid || isSubmitting}
                  type='submit'
                >
                  Save
                </Button>
              </div>
            </FormField>
          </form>
        </Form>
      )}
    </div>
  )
}

