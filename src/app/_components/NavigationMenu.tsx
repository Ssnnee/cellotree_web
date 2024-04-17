"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "~/components/ui/button";

import Link from "next/link";

import { UserButton, useUser } from "@clerk/nextjs";
import { Separator } from "~/components/ui/separator";
import { CreateTreeButton } from "./CreateTreeButton";
import Tree from "./Tree";

// left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
// fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",


export default function NavigationMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isSignedIn, user } = useUser();

  return (
    <div className="w-full">
      <header className='sticky top-0 z-50 w-full  border-b border-border/60 backdrop-blur'>
        <div className="container flex h-14 justify-between  items-center">
          <div className='flex gap-5 items-center p-4'>
            <Button variant="outline" size="icon"onClick={() => setIsOpen(!isOpen)}>
                <HamburgerMenuIcon className='text-3xl'  />
            </Button>
            <Link href="/">
              <h1 className='text-2xl font-bold '>CelloTree</h1>
            </Link>
          </div>
          <div className="flex w-52 justify-between items-center">
          {/*isSignedIn && <CreateTreeButton /> //>*/}
            <ModeToggle />
          </div>
        </div>
      </header>
      <div className={`border-r border w-80 bg-background absolute h-full transition-all flex flex-col items-center p-4 shadow-white ${isOpen ? "left-0" : "left-[-100%]"}`}>

      {!isSignedIn ?
        <Link href="/sign-in"> Connectez-vous </Link> :

        <div className="flex flex-col gap-4">
          <div className="flex text-xl gap-4 items-center">
            <UserButton afterSignOutUrl="/" />
            <div> {user.fullName} </div>
          </div>

          <Separator/>

          <div className="flex text-xl gap-4 items-center">
            <h2> Creer un nouvel arbre </h2>
            <CreateTreeButton  />
          </div>

          <Tree />
        </div>

      }
      </div>
    </div>
  );
}
