"use client"

import { CaretSortIcon, CheckIcon, CheckboxIcon, DotsHorizontalIcon, EyeOpenIcon, Link1Icon, Pencil1Icon, Share1Icon, TrashIcon } from "@radix-ui/react-icons"

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
  DialogTitle
} from "~/components/ui/dialog";
import { useState } from "react";
import { api } from "~/trpc/react";
import { MembrHook } from "~/app/_components/MemberHook";

import { FatherForm } from "~/app/_components/FatherForm"
import { MotherForm } from "~/app/_components/MotherForm"



const memberSchema = z.object({
  id: z.string(),
  firstname: z.string().nullable(),
  lastname: z.string(),
  birthdate: z.date().nullable(),
  sex: z.enum(["male", "female"]).nullable(),
  placeOfBirth: z.string().nullable(),
  avatarURL: z.string().nullable(),
  description: z.string().nullable(),
  treeId: z.string(),
})

export type Member = z.infer<typeof memberSchema>;

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "lastname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Nom
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0"
        >
          Prénom
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "birthdate",
    header: () => <div className="text-center">Date de naissance</div>,
  },
  {
    accessorKey: "sex",
    header: () => <div className="text-center">Genre</div>,
  },
  {
    accessorKey: "placeOfBirth",
    header: () => <div className="">Lieu de naissance</div>,
  },
  {
    accessorKey: "avatarURL",
    header: "Image",
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center">Description </div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original

      const [alertDialogIsOpen, setAlertDialogIsOpen] = useState(false)
      const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
      const [relationDialogIsOpen, setRelationDialogIsOpen] = useState(false)

      const deleteMember = api.member.delete.useMutation()

      const { treeMember } = MembrHook(member.treeId)

      const handleDelete = async () => {
        deleteMember.mutate(
          { id: member.id },
          {
            onSettled: () => {
              treeMember.refetch()
            }
          }
        )
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(member.id)}>
                <Link1Icon className="mr-2 h-3.5 w-3.5" />
                <p className="text-sm" onClick={() => setRelationDialogIsOpen(true)}>Ajouter ou voir les parents</p>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <EyeOpenIcon className="mr-2 h-3.5 w-3.5" />
                <p className="text-sm">Visualiser l&apos;arbre</p>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pencil1Icon className="mr-2 h-3.5 w-3.5" />
                <span onClick={() => setEditDialogIsOpen(true)}>Modifier les informations </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <TrashIcon className="mr-2 h-3.5 w-3.5" />
                <span onClick={() => setAlertDialogIsOpen(true)} >
                  Supprimer le membre
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={alertDialogIsOpen} onOpenChange={setAlertDialogIsOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Etes-vous sûr de vouloir supprimer cet membre? </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne pourra pas etre annulé
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} >Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog open={relationDialogIsOpen} onOpenChange={setRelationDialogIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajout d&apos;un d'un parent pour {member.firstname + " " + member.lastname}</DialogTitle>
                <DialogDescription>
                  Remplissez les champ ci-dessous pour ajouter un père, une mère ou des enfants
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 space-y-6">
                <FatherForm treeId={member.treeId} memberId={member.id} />
                <MotherForm treeId={member.treeId} memberId={member.id} />
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modification de l&apos;arbre</DialogTitle>
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
