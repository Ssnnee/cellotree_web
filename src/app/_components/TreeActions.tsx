"use client"
import { useState } from "react"
import { z } from "zod"
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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { UpdateTreeForm } from "./UpdateTreeForm"

export interface TreeActionsProps {
  treeInfo: {
    treeId: string
    treeName: string
    treeType: "private" | "public"
  }
}
export default function TreeActions({ treeInfo }: TreeActionsProps) {
  const [alertDialogIsOpen, setAlertDialogIsOpen] = useState(false)
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

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
            <span onClick={() => setDialogIsOpen(true)}>Modifier l'arbre</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <TrashIcon className="mr-2 h-3.5 w-3.5" />
            <span onClick={() => setAlertDialogIsOpen(true)} >
                Supprimer l'arbre
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={alertDialogIsOpen} onOpenChange={setAlertDialogIsOpen}>
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
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modification de l'arbre</DialogTitle>
            <DialogDescription>
              Remplissez les champ ci-dessous pour modifier cet arbre
            </DialogDescription>
            <UpdateTreeForm treeInfo={treeInfo} />
          </DialogHeader>
        </DialogContent>
    </Dialog>
    </>
  )
}
