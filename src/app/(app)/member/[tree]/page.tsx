"use client"

import { Button } from "~/components/ui/button"
import { DataTable } from "./data-table"
import { columns } from "./columns"
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
import Link from "next/link"


export default function  TreePage( { params }: { params: { tree: string } } ) {
  const treeMember  = api.member.getManyByTreeId.useQuery({ id:params.tree })
  const member = treeMember.data


  const getTree = api.tree.getById.useQuery({ id: params.tree })
  const treeName = getTree.data?.name

  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>
          Découvrez les membres de la famille {treeName}
        </PageHeaderHeading>
        <PageHeaderDescription>
          Ceci est la liste des membres de la famille {treeName }. Vous pouvez
          retrouver ici les informations de chaque membre de la famille, faire
          des recherches, filtrer les membres par nom, prénom, lieu de naissance
        </PageHeaderDescription>
        <PageActions>
          <Button asChild>
            <Link href={`/view/${params.tree}`} >Visualiser l&apos;arbre </Link>
          </Button>
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
