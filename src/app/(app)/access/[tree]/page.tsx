"use client"

import { Button } from "~/components/ui/button"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Card,
  CardContent,
} from "~/components/ui/card"
import { api } from "~/trpc/react"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from "~/app/_components/page-header"
import { AccesForm } from "~/app/_components/Access/AccessForm"
import { useRouter } from "next/navigation"
import { getCookie } from "typescript-cookie"

export default function TreePage({ params }: { params: { tree: string } }) {
  const router = useRouter()
  const isAdminOf = getCookie('isAdminOf')
  const isAdmin = isAdminOf === params.tree
  if (!isAdmin) {
    return  router.push("/")
  }

  const getUser = api.access.getAccessByTreeId.useQuery({ id: params.tree })
  const access = getUser.data ?? []
  const data = access.map((item) => ({
    username: item.user.username,
    email: item.user.email,
    access: {
      id: item.id,
      level: item.level,
      useId: item.userId,
      treeId: item.treeId,
    },
  }))

  const getTree = api.tree.getById.useQuery({ id: params.tree })
  const treeName = getTree.data?.name

  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>
          Administrer les accès de l&apos;arbre {treeName}
        </PageHeaderHeading>
        <PageHeaderDescription>
          Ceci est la liste des utilisateurs ayant des accès sur l&apos;arbre {treeName}.
          Vous pouvez retrouver ici les informations de chaque utilisateur.
          <br />
          Le droit d&pos;administrer permet à l&pos;utilisateur de modifier les
          droits des autres utilisateurs et de gérer l&apos;arbre.
          <br />
          Le droit de modifier permet à l&pos;utilisateur de modifier les
          informations de l&pos;rbre.
          <br />
          Le droit de voir l&pos;arbre permet à l&pos;utilisateur de voir l&pos;arbre.
          Ce droit est utile lorsque votre arbre est privé.
        </PageHeaderDescription>
        <PageActions>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Accorder un accès à un utilisateur</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl overflow-y-scroll max-h-screen">
              <DialogHeader>
                <DialogTitle>Accorder un accès à l&apos;utilisateur sur l&apos;arbre {treeName}</DialogTitle>
                <DialogDescription>
                  Remplissez les champs ci-dessous pour accoder un accès à un utilisateurs.
                </DialogDescription>
              </DialogHeader>
              <AccesForm treeId={params.tree} />
            </DialogContent>
          </Dialog>
        </PageActions>
      </PageHeader>
      <Card>
        <CardContent>
          <div className="">
            <div className="w-full flex items-center justify-between">
            </div>
            <br />
            <div className="w-full">
              {access.length > 0 ? (
                <DataTable columns={columns} data={data} />
              ) : (
                <div>Chargement...</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

