"use client"

import {
  CaretSortIcon,
} from "@radix-ui/react-icons"

import type { ColumnDef } from "@tanstack/react-table"
import { z } from "zod";
import { Button } from "~/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger
} from "~/components/ui/dialog";

import { format } from "date-fns";
import Image from "next/image";

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
                className="rounded"
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
                  className="rounded"
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
            member.father.firstname ?? "" :  "Non renseigné"
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
          { member.mother ? member.mother.lastname + " " +
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
]
