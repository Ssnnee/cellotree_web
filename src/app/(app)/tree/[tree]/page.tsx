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
import { MemberForm } from "~/app/_components/Member/MemberForm"
import { api } from "~/trpc/react"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from "~/app/_components/page-header"
import { getCookie } from "typescript-cookie"
import { useRouter } from "next/navigation"

export default function  TreePage( { params }: { params: { tree: string } } ) {
  const router = useRouter()
  const isAuthCookie = getCookie('isAuthorisedTo')
  const isAuthorised = isAuthCookie === params.tree
  if (!isAuthorised) {
    return  router.push("/")
  }

  const treeMember  = api.member.getManyByTreeId.useQuery({ id:params.tree })
  const member = treeMember.data

  const getTree = api.tree.getById.useQuery({ id: params.tree })
  const treeName = getTree.data?.name

  return (
      isAuthorised &&
        <div className="container relative">
          <PageHeader>
            <PageHeaderHeading>
              Page de gestion de l&apos;arbre {treeName}
            </PageHeaderHeading>
            <PageHeaderDescription>
              Ceci est la liste des membres de la famille {treeName }. Vous pouvez
              retrouver ici les informations de chaque membre de la famille, faire
              des recherches, filtrer les membres par nom, prénom, lieu de naissance
              Vous pouvez également ajouter un nouveau membre.
            </PageHeaderDescription>
            <PageActions>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default">Ajouter un membre à l&apos;arbre </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl overflow-y-scroll max-h-screen">
                  <DialogHeader>
                    <DialogTitle>Ajout d&apos;un nouveau membre à l&apos;arbre {treeName}</DialogTitle>
                    <DialogDescription>
                      Remplissez les champ ci-dessous pour ajouter un nouveau membre.
                    </DialogDescription>
                  </DialogHeader>
                    <MemberForm treeId={params.tree} />
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
                {member ? (
                  <DataTable columns={columns} data={member} />
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
