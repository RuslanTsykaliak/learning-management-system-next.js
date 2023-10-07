"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";

// Define the props for the Preview component.
interface PreviewProps {
  value: string; // The rich text content to be displayed in preview.
}

// Create the Preview component.
export const Preview = ({
  value, // The rich text content provided as a prop.
}: PreviewProps) => {
  // Use the `dynamic` function from Next.js to load the React Quill editor dynamically on the client side.
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return (
    // Render the React Quill editor in "bubble" theme with the provided value as read-only.
    <ReactQuill
      theme="bubble"
      value={value}
      readOnly
    />
  );
};
