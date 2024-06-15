"use client"

import { Button } from "~/components/ui/button";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from "~/app/_components/page-header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCookie } from "typescript-cookie";

export default function TreePage({ params }: { params: { tree: string } }) {
  const router = useRouter();
  const { data: treeData, isLoading: isLoadingTree } = api.tree.getById.useQuery({ id: params.tree });
  const { data: memberData, isLoading: isLoadingMembers } = api.member.getManyByTreeId.useQuery({ id: params.tree });

  const treeName = treeData?.name;
  const treeType = treeData?.type;
  const isAuthCookie = getCookie('isAuthorisedTo');

  if (!isLoadingTree && treeType !== "PUBLIC" && isAuthCookie !== params.tree) {
    router.push("/");
    return null;
  }

  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>
          Découvrez les membres de la famille {treeName}
        </PageHeaderHeading>
        <PageHeaderDescription>
          Ceci est la liste des membres de la famille {treeName}. Vous pouvez
          retrouver ici les informations de chaque membre de la famille, faire
          des recherches, filtrer les membres par nom, prénom, lieu de naissance
        </PageHeaderDescription>
        <PageActions>
          <Button asChild>
            <Link href={`/view/${params.tree}`}>Visualiser l&apos;arbre</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <Card>
        <CardContent>
          <div className="">
            <div className="w-full flex items-center justify-between"></div>
            <br />
            <div className="w-full">
              {!isLoadingMembers ? (
                memberData ? (
                  <DataTable columns={columns} data={memberData} />
                ) : (
                  <div>Aucun membre trouvé.</div>
                )
              ) : (
                <div>Chargement...</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

