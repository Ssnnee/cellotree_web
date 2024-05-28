"use client"

import {
    AvatarIcon,
  CaretSortIcon,
  DotsHorizontalIcon,
  EyeOpenIcon,
  Link1Icon,
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
  DialogTrigger
} from "~/components/ui/dialog";
import { useState } from "react";
import { api } from "~/trpc/react";
import { MembrHook } from "~/app/_components/Member/MemberHook";

import { FatherForm } from "~/app/_components/Member/FatherForm"
import { MotherForm } from "~/app/_components/Member/MotherForm"
import { toast } from "~/components/ui/use-toast";
import { format } from "date-fns";
import Image from "next/image";
import { UpdateMemberForm } from "~/app/_components/Member/UpdateMemberForm";
import { UpdateMemberAvatarForm } from "~/app/_components/Member/UpdateMemberAvatarForm";
import { deleteFile } from "~/actions/file.actions";
import { ParentForm } from "~/app/_components/Member/RelationForm";



const memberSchema = z.object({
  id: z.string(),
  firstname: z.string().nullable(),
  lastname: z.string(),
  birthdate: z.date().nullable(),
  sex: z.enum(["masculin", "feminin"]).nullable(),
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
          className="px-3"
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
          className="mx-3"
        >
          Prénom
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const firstname = row.getValue("firstname") as string
      return <div className="">{firstname}</div>
    }
  },
  {
    accessorKey: "birthdate",
    header: () => <div className="text-center">Date de naissance</div>,
    cell: ({ row }) => {
      const birthdate = row.getValue("birthdate") as Date

      return <div className="text-center">{format(new Date(birthdate), "dd MMM yyyy")}</div>
    }
  },
  {
    accessorKey: "sex",
    header: () => <div className="text-center md:w-[200px]">Genre</div>,
  },
  {
    accessorKey: "placeOfBirth",
    header: () => <div className="md:w-[180px]">Lieu de naissance</div>,
    cell: ({ row }) => {
      const placeOfBirth = row.getValue("placeOfBirth") as string
      return <div className="text-left">{placeOfBirth}</div>
    }
  },
  {
    accessorKey: "avatarURL",
    header: "Image",
    cell: ({ row }) => {
      const url = row.getValue("avatarURL") as string
      const memberName = row.getValue("firstname") as string
      return (
          <Dialog>
            <DialogTrigger asChild>
              <Image
                src={url}
                alt={`Avatar de ${memberName}`}
                width={32}
                height={32}
                className="rounded-full"
              />
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
              </DialogHeader>
                <Image
                  src={url}
                  alt={`Avatar de ${memberName}`}
                  width={400}
                  height={400}
                  className="rounded-full"
                />
            </DialogContent>
          </Dialog>
      )
    }
  },
  {
    accessorKey: "pere",
    header: () => <div className="text-center md:w-[200px]">Père</div>,
    cell: ({ row }) => {
      const member = row.original

      const getMember = api.member.getById.useQuery({ id: member.id });
      const memberWithRelation = getMember.data;
      const fatherRelation = memberWithRelation?.relation?.find((relation) => relation.type === "pere");
      const getFather = api.member.getById.useQuery({ id: fatherRelation?.parentId ?? "" });
      const father = getFather.data;

      return (
        <div className="text-center">
          {father ? father.lastname + " " + father.firstname : "Non renseigné"}
        </div>
      )
    }
  },
  {
    accessorKey: "mere",
    header: () => <div className="text-center md:w-[200px]">Mère</div>,
    cell: ({ row }) => {
      const member = row.original

      const getMember = api.member.getById.useQuery({ id: member.id });
      const memberWithRelation = getMember.data;
      const motherRelation = memberWithRelation?.relation?.find((relation) => relation.type === "mere");
      const getMother = api.member.getById.useQuery({ id: motherRelation?.parentId ?? "" });
      const mother = getMother.data;

      return (
        <div className="text-center">
          {mother ? mother.lastname + " " + mother.firstname : "Non renseigné"}
        </div>
      )
    }
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center w-max-[200px]">Description </div>,
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return <div className="text-center w-44">{description}</div>
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const member = row.original

      const [alertDialogIsOpen, setAlertDialogIsOpen] = useState(false)
      const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
      const [editAvatarDialogIsOpen, setEditAvatarDialogIsOpen] = useState(false)
      const [parentDialogIsOpen, setParentDialogIsOpen] = useState(false)

      const deleteMember = api.member.delete.useMutation()

      const { treeMember } = MembrHook(member.treeId)

      console.log("File path", member.avatarURL)

      const handleDelete = async () => {
        const form = new FormData()
        form.append("path", member.avatarURL ?? "")
        const res = await deleteFile(form)
        if (res.error) {
          toast({
            title: "Une erreur s'est produite lors de la suppression de l'avatar",
          })
        }
        deleteMember.mutate(
          { id: member.id },
          {
            onSettled: () => {
              toast({
                title: "Le membre a été supprimé de l'arbre",
          })
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
                <p className="text-sm" onClick={() => setParentDialogIsOpen(true)}>Ajouter ou voir les parents</p>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <EyeOpenIcon className="mr-2 h-3.5 w-3.5" />
                <p className="text-sm">Visualiser l&apos;arbre</p>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <AvatarIcon className="mr-2 h-3.5 w-3.5" />
                <span onClick={() => setEditAvatarDialogIsOpen(true)}>Changer l&apos;avatar </span>
              </DropdownMenuItem>
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
          <AlertDialog open={alertDialogIsOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Etes-vous sûr de vouloir supprimer cet membre? </AlertDialogTitle>
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
          <Dialog open={parentDialogIsOpen} onOpenChange={setParentDialogIsOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Ajout d&apos;un d&apos;un parent pour {member.firstname + " " + member.lastname}</DialogTitle>
                <DialogDescription>
                  Remplissez les champ ci-dessous pour ajouter un père, une mère ou des enfants
                </DialogDescription>
              </DialogHeader>
              <ParentForm memberId={member.id} treeId={member.treeId} />
            </DialogContent>
          </Dialog>
          <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Modification du membre {member.firstname + " " + member.lastname}</DialogTitle>
                <DialogDescription>
                  Remplissez les champ ci-dessous pour modifier cet arbre
                </DialogDescription>
                <UpdateMemberForm
                  setDialogIsOpen={setEditDialogIsOpen}
                  member={member}
                  treeId={member.treeId}
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog open={editAvatarDialogIsOpen} onOpenChange={setEditAvatarDialogIsOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Modification de l&apos;avatar {member.firstname + " " + member.lastname}</DialogTitle>
                <DialogDescription>
                  Veuiller choisir l&apos;image à metrre.
                </DialogDescription>
                <UpdateMemberAvatarForm
                  setDialogIsOpen={setEditAvatarDialogIsOpen}
                  member={member}
                  treeId={member.treeId}
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )
    },
  },
]
