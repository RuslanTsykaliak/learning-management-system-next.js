import { IconBadge } from "@/components/IconBadge";
import { LucideIcon } from "lucide-react";

// InfoCardProps defines the prop types for the InfoCard component
interface InfoCardProps {
  numberOfItems: number; // The number of items to display
  variant?: "default" | "success"; // An optional variant for styling (default or success)
  label: string; // The label or title for the card
  icon: LucideIcon; // An icon to display on the card
}

// InfoCard component displays information with an icon and label
export const InfoCard = ({
  variant, // Optional variant
  icon: Icon, // Icon to display
  numberOfItems, // Number of items
  label, // Label or title
}: InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge
        variant={variant}
        icon={Icon}
      />
      <div>
        <p className="font-medium">
          {label} {/* Display the label or title */}
        </p>
        <p className="text-gray-500 text-sm">
          {/* Display the number of items with appropriate pluralization */}
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  )
}
