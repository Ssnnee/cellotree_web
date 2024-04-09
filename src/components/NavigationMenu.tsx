"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";


export default function NavigationMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="w-full">
      <header className='sticky top-0 z-50 w-full  border-b border-border/60 backdrop-blur'>
        <div className="container flex h-14 justify-between  items-center">
          <div className='flex gap-5 items-center p-4'>
            <Button variant="outline" size="icon"onClick={() => setIsOpen(!isOpen)}>
                <HamburgerMenuIcon className='text-3xl'  />
            </Button>
            <h1 className='text-2xl font-bold '>CelloTree</h1>
          </div>
          <ModeToggle />
        </div>
      </header>
      <div className={`border-r border w-60 absolute h-full transition-all flex flex-col items-center justify-center shadow-white ${isOpen ? "left-0" : "left-[-100%]"}`}>
          <div className="text-[#f00] font-bold"> Hiii </div>
          <div className="text-green-500"> Hiii </div>
      </div>
    </div>
  );
}


