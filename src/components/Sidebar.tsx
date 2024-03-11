import React from "react";
import { UserButton } from "@clerk/nextjs";

import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside className={`border-r border-gray-700 w-60 absolute h-full transition-all flex flex-col items-center justify-center shadow-white ${isOpen ? "left-0" : "left-[-150%]"}`}>
          <Link href="/protected" className="text-xl text-white">
            Cliquer ici pour vous connecter
          </Link>
        <UserButton afterSignOutUrl="/" />
    </aside>
  );
}

export default Sidebar;

