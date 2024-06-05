"use client"

import {
  AvatarIcon,
  CaretSortIcon,
  DotsHorizontalIcon,
  EyeOpenIcon,
  Pencil1Icon,
  TrashIcon
} from "@radix-ui/react-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"

import type { ColumnDef } from "@tanstack/react-table"
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "~/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useState } from "react";

const userSchema =z.object({
  username: z.string(),
  email: z.string(),
  access : z.object({
    id: z.string(),
    level: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
    useId: z.string(),
    treeId: z.string(),
  }),
}).nullable()

export type Access = z.infer<typeof userSchema>;

export const columns: ColumnDef<Access>[] = [
  {
    accessorKey: "username",
    header: () => {
      return (
        <div className="text-center"> Nom d'utilisateur </div>
      )
    },

  },
  {
    accessorKey: "email",
    header: () => <div className="text-center"> Addresse électrinique </div>,
  },
  {
    accessorKey: "access",
    header: () => {
      return ( <div className="text-center"> Role </div> )
    },
    cell: ({ row }) => {
      const value = row.original?.access
      return (
        <div>
          {value?.level}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original

      const [alertDialogIsOpen, setAlertDialogIsOpen] = useState(false)
      const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
      const [editAvatarDialogIsOpen, setEditAvatarDialogIsOpen] = useState(false)

      const handleDelete = async () => {
      }

      return (
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <DotsHorizontalIcon />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Actions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pencil1Icon className="mr-2 h-3.5 w-3.5" />
                <span onClick={() => setEditDialogIsOpen(true)}>Modifier l&apos;accès </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <TrashIcon className="mr-2 h-3.5 w-3.5" />
                <span onClick={() => setAlertDialogIsOpen(true)} >
                  Supprimer l&apos;accès
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={alertDialogIsOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Etes-vous sûr de vouloir revoquer  cet accès ? </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne pourra pas être annulé
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} >Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Modification de l&apos;acccès de l&apos;utilisateur {user?.username} </DialogTitle>
                <DialogDescription>
                  Remplissez les champ ci-dessous pour modifier cet arbre
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
  },
]
