import { AlertTriangle, CheckCircleIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Create bannerVariants using a utility function (cva) to define CSS classes for different variants.
const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
      }
    },
    defaultVariants: {
      variant: "warning", // Set the default variant to "warning"
    }
  }
);

// Define the props for the Banner component, including the 'label' and variant.
interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string; // Text label to be displayed in the banner
}

// Define an icon mapping for different banner variants.
const iconMap = {
  warning: AlertTriangle, // Icon for warning variant
  success: CheckCircleIcon, // Icon for success variant
};

// Define the Banner React component.
export const Banner = ({
  label,
  variant, // Variant prop for the banner (e.g., "warning" or "success")
}: BannerProps) => {
  // Get the appropriate icon component based on the 'variant' prop.
  const Icon = iconMap[variant || "warning"];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2" /> {/* Display the icon */}
      {label} {/* Display the label text */}
    </div>
  );
};
