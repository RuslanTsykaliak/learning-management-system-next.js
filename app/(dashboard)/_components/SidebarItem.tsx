'use client'

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon; // Icon to display
  label: string; // Label for the sidebar item
  href: string; // URL to navigate when clicked
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) => {
  const pathname = usePathname(); // Get the current pathname
  const router = useRouter(); // Get the router for navigation

  const isActive =
    (pathname === "/" && href === "/") || // Check if it's the home page
    pathname === href || // Check if it's the exact match of the pathname
    pathname?.startsWith(`${href}/`); // Check if it starts with the pathname

  const onClick = () => {
    router.push(href); // Navigate to the specified URL
  }

  return (
    <button
      onClick={onClick} // Handle click event
      type="button" // Set the element type
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )} // Apply conditional CSS classes based on activity
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-sky-700"
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      /> 
    </button>
  )
}
