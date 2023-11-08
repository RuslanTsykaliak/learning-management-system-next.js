import { generateComponents } from '@uploadthing/react';

import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Generates three components for uploading files based on the specified file router.
export const { UploadButton, UploadDropzone, Uploader } = generateComponents<OurFileRouter>();
