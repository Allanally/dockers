"use client";
import { useState, useEffect } from "react";
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";
import { useAuth } from "@clerk/nextjs"; // useAuth hook for client-side

export const Sidebar = () => {
  const { userId, isLoaded } = useAuth(); // isLoaded indicates when the auth check is complete
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setLoading(false); // stop loading once the user data is fetched
    }
  }, [isLoaded]);

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="loader"></div> {/* Replace with your loader component or CSS animation */}
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6 flex items-center gap-2 justify-center">
        <Logo />
        <p className="text-[18px] text-[#0369A1]">DOCUSHELF</p>
      </div>
      <div className="flex flex-col w-full">
        {userId ? <SidebarRoutes /> : null }
      </div>
    </div>
  );
};
