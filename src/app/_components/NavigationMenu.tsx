"use client";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import { CreateTreeButton } from "./CreateTreeButton";
import Tree from "./Tree/Tree";
import { SignInDialog } from "./User/SignInDialog";


export default function NavigationMenu() {
  const [isOpen, setIsOpen] = React.useState(true);
  // const { isSignedIn, user } = useUser();
  const isSignedIn = false

  return (
    <div className="w-full">
      <header className='sticky top-0 z-50 w-full h-[58px] border-b border backdrop-blur'>
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
            <SignInDialog />
          </div>
        </div>
      </header>
      <div className={`border-r z-40 border w-80 bg-background absolute h-full transition-all flex flex-col items-center p-4 shadow-white ${isOpen ? "left-0" : "left-[-100%]"}`}>

      {!isSignedIn ?
        <Link href="/sign-in"> Connectez-vous </Link> :

        <div className="flex flex-col gap-4">
          <div className="flex text-xl gap-4 items-center">
            // <div> user.fullName </div>
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
