import { LucideIcon } from "lucide-react";
import { cva, type VariantProps }  from "class-variance-authority";

import { cn } from "@/lib/utils";

// Define background variants for the badge.
const backgroundVariants = cva(
  "rounded-full flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-sky-100", // Default background color.
        success: "bg-emerald-100", // Background color for success variant.
      },
      size: {
        default: "p-2", // Default padding size.
        sm: "p-1", // Padding size for small variant.
      }
    },
    defaultVariants: {
      variant: "default", // Default background variant.
      size: "default", // Default padding size variant.
    }
  }
);

// Define icon variants.
const iconVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "text-sky-700", // Default icon color.
        success: "text-emerald-700", // Icon color for success variant.
      },
      size: {
        default: "h-8 w-8", // Default icon size.
        sm: "h-4 w-4" // Icon size for small variant.
      },
    },
    defaultVariants: {
      variant: "default", // Default icon color variant.
      size: "default", // Default icon size variant.
    }
  }
);

// Define prop types for the background and icon variants.
type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

// Define props for the IconBadge component.
interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps {
  icon: LucideIcon; // The icon to be displayed.
};

export const IconBadge = ({
  icon: Icon, // The icon to be displayed.
  variant, // The badge background variant (e.g., default or success).
  size, // The badge and icon size variant (e.g., default or sm).
}: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      {/* Render the specified icon with the configured style. */}
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  )
};
