import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines tailwind and custom classnames into a unified classNames function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This code creates a function named cn that takes various class names, both from Tailwind CSS and custom ones, and merges them using the clsx function from the clsx library and twMerge from the tailwind-merge library. This unified cn function allows you to use both Tailwind CSS and other custom class names together within your components.