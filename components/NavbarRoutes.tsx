"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/teacher";

import { SearchInput } from './SearchInput'


export const NavbarRoutes = () => {
  // Get the current user's ID using the useAuth() hook.
  const { userId } = useAuth();

  // Get the current pathname from the router.
  const pathname = usePathname();

  // Check if the current page is a teacher-related page.
  const isTeacherPage = pathname?.startsWith("/teacher");

  // Check if the current page is a course-related page.
  const isCoursePage = pathname?.includes("/courses");

  // Check if the current page is the search page.
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        // Render a SearchInput component if the current page is the search page.
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          // Render an "Exit" button for teacher or course-related pages,
          // which links back to the home page ("/").
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          // If the user is a teacher, render a "Teacher mode" button that links to the teacher's courses.
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        ) : null}
        {/* Render a UserButton component with an afterSignOutUrl of "/" */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
}
