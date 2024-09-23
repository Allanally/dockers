"use client";

import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { Button } from "./ui/button";
import { useAuth, UserButton } from "@clerk/nextjs";
import { isTeacher } from "@/lib/teacher";

export const NavBarRoutes = () => {
    const pathname = usePathname();
    const { userId } = useAuth();
    const isTeacherPage = pathname?.startsWith("/admin");
    const isCoursePage = pathname?.includes("/docs");
    const isSearchPage = pathname === "/search"

    if(!userId) {
     return (
        <div className="flex gap-x-2 ml-auto">
            <Link href="/sign-in">
             <Button>
                Login
            </Button>
            </Link>
           
        </div>
     )
    }

 
    return (
        <>
        {isSearchPage && (
            <div className="hidden md:block">
                <SearchInput />
            </div>
        )}
        <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isCoursePage ? (
                <Link href="/search">
                <Button size="sm" variant="ghost">
                    <LogOut className="h-4 w-4 mr-2" />
                    Exit
                </Button>
                </Link>
            ) : isTeacher(userId) ? (
                <Link href="/admin/docs
                ">
                    <Button size="sm" variant="ghost">
                         Admin Mode
                    </Button>
                </Link>
            ): null}
                <UserButton
                afterSignOutUrl="/sign-in" />        
        </div></>
    )
}