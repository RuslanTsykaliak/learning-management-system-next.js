'use client'

import { UserButton, useAuth } from "@clerk/nextjs"
import { Link } from "next/link"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { usePathname } from "next/navigation"

export const NavbarRoutes = () => {
    const { userId } = useAuth()
    const pathname = usePathname()

    const isTeacherPage = pathname?.startsWith('/teacher')
    const isCoursePage = pathname?.startsWith('/courses')
    const isSearchPage = pathname === '/search'

    return (
        <>
            {isSearchPage && (
                <div className="hidden mb:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isTeacherPage || isCoursePage ? (
                    <Link href='/'>
                        <Button size='sm' variant='ghost'>
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                ) : null}
                <UserButton
                    afterSignOutUrl="/"
                />
            </div>
        </>
    )
}