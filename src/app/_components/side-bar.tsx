import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import { Button } from "~/components/ui/button"
import { useState } from "react"
import { CreateTreeButton } from "./CreateTreeButton"
import Tree from "./Tree/Tree"
import Link from "next/link"


interface SideBarProps {
    userId: string;
}
export function SideBar({ userId }: SideBarProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex flex-col gap-4 mr-2 mt-1 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <svg
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-5"
          >
            <path
              d="M3 5H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 12H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 w-80 " >
        <Link href="/">
            <h1 className='bock text-2xl font-bold sm:hidden '>CelloTree</h1>
        </Link>
        <div className="flex text-xl gap-4 items-center py-9">
          <h2> Creer un nouvel arbre </h2>
          <CreateTreeButton userId={userId} setOpened={setOpen}  />
        </div>
        <Tree userId={userId}/>
      </SheetContent>
    </Sheet>
  )
}
