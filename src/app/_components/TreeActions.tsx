"use client"
import { useState } from "react"
import { DotsHorizontalIcon, EyeOpenIcon, Pencil1Icon, Share1Icon, TrashIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"


export default function TreeActions() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <DotsHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Share1Icon className="mr-2 h-3.5 w-3.5" />
            <p className="text-sm">Partager l'arbre</p>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EyeOpenIcon className="mr-2 h-3.5 w-3.5" />
            <p className="text-sm">Visualiser l'arbre</p>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Pencil1Icon className="mr-2 h-3.5 w-3.5" />
            <p className="text-sm">Modifier l'arbre</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <TrashIcon className="mr-2 h-3.5 w-3.5" />
            <span onClick={() => setIsOpen(true)} >
                Supprimer l'arbre
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Etes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne pourra pas etre annulé
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
