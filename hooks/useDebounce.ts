import { useEffect, useState } from "react";

// Define a custom hook called useDebounce, which takes a value and an optional delay.
export function useDebounce<T>(value: T, delay?: number): T {
  // Initialize a state variable debouncedValue with the provided value.
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Inside the useEffect hook, set up a timer that updates the debouncedValue after the specified delay.
    const timer = setTimeout(() => {
      setDebouncedValue(value); // Update debouncedValue with the current value.
    }, delay || 500); // Use the provided delay or default to 500 milliseconds.

    // Return a cleanup function that clears the timer when the value or delay changes or when the component unmounts.
    return () => {
      clearTimeout(timer); // Clear the timer to prevent the update if the value changes within the delay.
    };
  }, [value, delay]); // Re-run the effect whenever the value or delay changes.

  // Return the debouncedValue, which will be updated after the specified delay.
  return debouncedValue;
}
