'use client'

import axios from "axios"
import { useState } from "react"
import toast from 'react-hot-toast'

import { Button } from "@/components/ui/button"
import { formatPrice } from '@/lib/format'

interface CourseEnrollButtonProps {
  // The price of the course
  price: number;
  // The ID of the course
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  // State to track whether the button is loading
  const [isLoading, setIsLoading] = useState(false);

  // Function to be called when the button is clicked
  const onClick = async () => {
    try {
      // Set the isLoading state to true to indicate that the button is loading
      setIsLoading(true);

      // Make a POST request to the API to enroll the user in the course
      const response = await axios.post(`/api/course/${courseId}/checkout`);

      // Redirect the user to the checkout page
      window.location.assign(response.data.url);
    } catch (error) {
      // Show an error toast notification if something goes wrong
      toast.error("Something went wrong");
    } finally {
      // Set the isLoading state to false to indicate that the button is no longer loading
      setIsLoading(false);
    }
  };

  // Render the CourseEnrollButton component
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size='sm'
      className="w-full md:w-auto"
    >
      Entoll for {formatPrice(price)}
    </Button>
  );
};
