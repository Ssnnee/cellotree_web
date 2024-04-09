"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import React from "react";


export default function NavigationMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="w-full">
      <header className='top-0 z-50 w-full justify-between  border-b border'>
        <div className='container mx-auto flex gap-5 items-center p-4'>
          <button onClick={() => setIsOpen(!isOpen)}>
              <HamburgerMenuIcon className='text-3xl'  />
          </button>
          <h1 className='text-2xl font-bold '>CelloTree</h1>
        </div>
      </header>
      <div className={`border-r border w-60 absolute h-full transition-all flex flex-col items-center justify-center shadow-white ${isOpen ? "left-0" : "left-[-100%]"}`}>
          <div className="text-[#f00] font-bold"> Hiii </div>
          <div className="text-green-500"> Hiii </div>
      </div>
    </div>
  );
}


