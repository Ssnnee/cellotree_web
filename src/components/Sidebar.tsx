import React from "react";

interface SidebarProps {
    isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <div className={`border-r border-gray-700 w-60 absolute h-full transition-all flex flex-col items-center justify-center shadow-white ${isOpen ? "left-0" : "left-[-100%]"}`}>
        <div className="text-[#f00] font-bold"> Hiii </div>
        <div className="text-green-500"> Hiii </div>
    </div>
  );
}

