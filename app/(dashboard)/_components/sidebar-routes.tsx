"use client";
import { Layout, Compass, List, Bell } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [ 
{
    icon: Layout,
    label:"Dashboard",
    href: "/dashboard"
},
{
    icon: Compass,
    label:"Browse",
    href: "/search"
}
 ]

 const teacherRoutes = 
 [ 
    {
        icon:List,
        label:"Documents",
        href: "/admin/docs"
    },
    {
        icon: Bell,
        label:"Notifications",
        href: "/admin/notifications"
    },

     ]

export const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/admin");
    const routes = isTeacherPage ? teacherRoutes : guestRoutes ;

   return (
    <div className="flex flex-col w-full">
       {routes.map((route) => (
        <SidebarItem key={route.href} icon={route.icon} label={route.label} href={route.href} />
       ))}
    </div>
   )
}