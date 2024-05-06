"use client"
import Link from "next/link"
import { MembrHook } from "~/app/_components/MemberHook"
import { Button } from "~/components/ui/button"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { MemberForm } from "~/app/_components/MemberForm"
import { api } from "~/trpc/react"


export default function  TreePage( { params }: { params: { tree: string } } ) {
  const { treeMember } = MembrHook(params.tree)
  const member = treeMember.data?.member

  const getTree = api.tree.getById.useQuery({ id: params.tree })
  const treeName = getTree.data?.name

  return (
    <div className="flex flex-col h-screen justify-center items-center align-middle">
      <div className="w-full flex items-center justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Ajouter un membre à l&apos;arbre </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajout d&apos;un nouveau membre à l&apos;arbre {treeName}</DialogTitle>
              <DialogDescription>
                Remplissez les champ ci-dessous pour ajouter un nouveau membre.
              </DialogDescription>
            </DialogHeader>
              <MemberForm treeId={params.tree} />
          </DialogContent>
        </Dialog>
      </div>
      <br />

    <div className="">
      {member ? (
        <DataTable columns={columns} data={member} />
      ) : (
        <div>Chargement...</div>
      )}
    </div>

    </div>
  )
}

