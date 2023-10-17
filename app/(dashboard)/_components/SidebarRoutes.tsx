"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./SidebarItem";

// Define sets of routes for guest and teacher users
const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
]

// SidebarRoutes component renders appropriate routes based on the user's role
export const SidebarRoutes = () => {
  const pathname = usePathname();

  // Determine if the current page is a teacher page
  const isTeacherPage = pathname?.includes("/teacher");

  // Select routes based on the user's role
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {/* Render the selected routes using SidebarItem components */}
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}
