"use client"

import {
  CaretSortIcon,
  DotsHorizontalIcon,
  EyeOpenIcon,
  Link2Icon,
  Pencil1Icon,
  TrashIcon,
  UploadIcon
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

import { toast } from "~/components/ui/use-toast";
import { format } from "date-fns";
import Image from "next/image";
import { UpdateMemberForm } from "~/app/_components/Member/UpdateMemberForm";
import { UpdateMemberAvatarForm } from "~/app/_components/Member/UpdateMemberAvatarForm";
import { deleteFile } from "~/actions/file.actions";
import Link from "next/link";
import { SpouseForm } from "~/app/_components/Member/SpouseForm";



const member = z.object({
  id: z.string(),
  firstname: z.string().nullable(),
  lastname: z.string(),
  birthdate: z.date().nullable(),
  sex: z.enum(["M", "F"]).nullable(),
  placeOfBirth: z.string().nullable(),
  avatarURL: z.string().nullable(),
  description: z.string().nullable(),
  treeId: z.string(),
  fatherId: z.string().nullable(),
  motherId: z.string().nullable(),
})

const memberSchema = member.extend({
  father: member.nullable(),
  mother: member.nullable(),
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
        >
          Nom
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },

    cell: ({ row }) => {
      const lastname = row.getValue("lastname") as string
      return <div className="text-left ml-4">{lastname}</div>
    }
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prénom
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const firstname = row.getValue("firstname") as string
      return <div className="text-left ml-4">{firstname}</div>
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
    header: () => <div className="text-center md:w-max ">Genre</div>,
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
    accessorKey: "father",
    header: () => <div className="text-center md:w-[200px]">Père</div>,
    cell: ({ row }) => {
      const member = row.original

      return (
        <div className="text-center">
          {
            member.father ? member.father.lastname + " " +
              member.father.firstname ?? "" : "Non renseigné"
          }
        </div>
      )
    }
  },
  {
    accessorKey: "mother",
    header: () => <div className="text-center md:w-[200px]">Mère</div>,
    cell: ({ row }) => {
      const member = row.original

      return (
        <div className="text-center">
          {member.mother ? member.mother.lastname + " " +
            member.mother.firstname ?? "" : "Non renseigné"
          }
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
      return <ActionsMenu member={member} />
    },
  },
]

const ActionsMenu = ({ member }: { member: Member }) => {
  const [alertDialogIsOpen, setAlertDialogIsOpen] = useState(false)
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false)
  const [editAvatarDialogIsOpen, setEditAvatarDialogIsOpen] = useState(false)
  const [addSpouseIsOpen, setAddSpouseIsOpen] = useState(false)

  const deleteMember = api.member.delete.useMutation()
  const treeMember = api.member.getManyByTreeId.useQuery({ id: member.treeId })

  const handleDelete = async () => {
    const form = new FormData()
    form.append("path", member.avatarURL ?? "")
    const res = await deleteFile(form)
    if (!res.success) {
      toast({
        title: "Une erreur s'est produite lors de la suppression de l'avatar",
      })
    }
    deleteMember.mutate(
      { id: member.id },
      {
        onSuccess: () => {
          toast({
            title: "Le membre a été supprimé de l'arbre",
          })
          treeMember.refetch()
        },
        onError: (error) => {
          console.error(error)
          toast({
            title: "Une erreur s'est produite lors de la suppression du membre",
          })
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
          <DropdownMenuItem>
            <EyeOpenIcon className="mr-2 h-3.5 w-3.5" />
            <Link href={`/view/${member.treeId}`}>
              Visualiser l&apos;arbre
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem>
          <Link2Icon className="mr-2 h-3.5 w-3.5" />
          <span onClick={() => setAddSpouseIsOpen(true)}> Ajouter un conjoint </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UploadIcon className="mr-2 h-3.5 w-3.5" />
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
      <AlertDialog open={alertDialogIsOpen} onOpenChange={setAlertDialogIsOpen}>
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
      <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modification du membre {member.firstname + " " + member.lastname}</DialogTitle>
            <DialogDescription>
              Remplissez les champ ci-dessous pour modifier cet arbre
            </DialogDescription>
          </DialogHeader>
          <UpdateMemberForm
            setDialogIsOpen={setEditDialogIsOpen}
            member={member}
            treeId={member.treeId}
          />
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
      <Dialog open={addSpouseIsOpen} onOpenChange={setAddSpouseIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajout d&apos;un conjoint au membre {member.firstname + " " + member.lastname}</DialogTitle>
            <DialogDescription>
              Veuiller choisir l&apos;un conjoint.
              Les conjoints doivent être déjà existant dans l&apos;arbre.
              Les conjoints sont importants pour la génération de la
              visualisation de l&apos;arbre.
            </DialogDescription>
              <SpouseForm
              id={member.id}
              treeId={member.treeId}
              sex={member.sex}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
