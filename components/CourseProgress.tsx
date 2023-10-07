import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  value: number; // The progress value as a percentage.
  variant?: "default" | "success"; // The variant style for the progress indicator.
  size?: "default" | "sm"; // The size of the progress indicator and text.
};

// Define CSS color classes based on the variant.
const colorByVariant = {
  default: "text-sky-700", // Default color class.
  success: "text-emerald-700", // Color class for a successful (completed) progress.
}

// Define CSS size classes based on the size variant.
const sizeByVariant = {
  default: "text-sm", // Default size class.
  sm: "text-xs", // Smaller size class.
}

export const CourseProgress = ({
  value, // Progress value as a percentage (required).
  variant, // Progress variant style (optional).
  size, // Progress size (optional).
}: CourseProgressProps) => {
  return (
    <div>
      {/* Display the progress bar with specified height and variant. */}
      <Progress
        className="h-2"
        value={value}
        variant={variant}
      />
      {/* Display the progress percentage with specified font style, color, and size. */}
      <p className={cn(
        "font-medium mt-2 text-sky-700", // Base font style.
        colorByVariant[variant || "default"], // Apply color based on variant.
        sizeByVariant[size || "default"], // Apply size based on size variant.
      )}>
        {Math.round(value)}% Complete
      </p>
    </div>
  )
}
