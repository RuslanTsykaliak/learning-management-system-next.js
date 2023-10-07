"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void; // Callback function to handle text changes.
  value: string; // The current value of the text editor.
}

export const Editor = ({
  onChange, // Callback function to handle text changes.
  value, // The current value of the text editor.
}: EditorProps) => {
  // Dynamically load the ReactQuill component when needed, skipping server-side rendering (SSR).
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

  return (
    <div className="bg-white">
      {/* Render the ReactQuill component with specified properties. */}
      <ReactQuill
        theme="snow" // Specify the editor theme.
        value={value} // Set the initial value of the editor.
        onChange={onChange} // Attach the onChange callback to handle text changes.
      />
    </div>
  );
};
