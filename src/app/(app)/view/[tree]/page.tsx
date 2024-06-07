"use client";

import React from "react";
import { FamilyChart } from "./tree-view-example";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from "~/app/_components/page-header";
import { Button } from "~/components/ui/button";
import Link from "next/link";

interface Base {
  id: string;
  firstname: string | null;
  lastname: string;
  birthdate: Date | null;
  avatarURL: string | null;
  sex: string;
  fatherId: string | null;
  motherId: string | null;
  description: string | null;
}

interface Member extends Base {
  spouses: Base[];
  spouseOf: Base[];
  fatherChildren: Base[];
  motherChildren: Base[];
}

interface Data {
  id: string;
  rels: {
    spouses?: string[];
    children?: string[];
    father?: string;
    mother?: string;
  };
  data: {
    "first name"?: string;
    "last name"?: string;
    birthday?: string;
    avatar?: string;
    gender?: string;
    description?: string;
  };
}

export default function ViewPage({ params }: { params: { tree: string } }) {
  const treeMemberQuery = api.member.getMembersByTreeId.useQuery({ id: params.tree });
  const treeQuery = api.tree.getById.useQuery({ id: params.tree });

  if (treeMemberQuery.isLoading || treeQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (treeMemberQuery.isError || treeQuery.isError || !treeMemberQuery.data || !treeQuery.data) {
    return <div>Error loading data</div>;
  }

  const members = treeMemberQuery.data.member;
  const treeName = treeQuery.data.name;
  const data = transformData(members);

  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>
          Découvrez les membres de la famille {treeName} en visualisant l&apos;arbre généalogique
        </PageHeaderHeading>
        <PageHeaderDescription>
          Ceci est la liste des membres de la famille {treeName}. Vous pouvez
          retrouver de manière visuelle les informations des membres ayant des
          parents renseignés.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild>
            <Link href={`/member/${params.tree}`}>
              Voir la liste des membres et plus d&apos;informations.
            </Link>
          </Button>
        </PageActions>
      </PageHeader>
      <FamilyChart data={data} />
    </div>
  );
}

function transformData(apiData: Member[]): Data[] {
  const membersMap = new Map<string, Data>();

  apiData.forEach(member => {
    membersMap.set(member.id, {
      id: member.id,
      rels: {
        spouses: member.spouses.length > 0
          ? member.spouses.map(spouse => spouse.id)
          : member.spouseOf.map(spouse => spouse.id) ?? [],
        father: member.fatherId ?? undefined,
        mother: member.motherId ?? undefined,
        children: member.sex === "M"
          ? member.fatherChildren.map(child => child.id)
          : member.motherChildren.map(child => child.id) ?? []
      },
      data: {
        "first name": member.firstname ?? "",
        "last name": member.lastname,
        birthday: member.birthdate ? format(new Date(member.birthdate), "dd MMM yyyy") : "",
        avatar: member.avatarURL ?? "",
        gender: member.sex,
        description: member.description ?? ""
      }
    });
  });

  apiData.forEach(member => {
    if (member.fatherId) {
      const father = membersMap.get(member.fatherId);
      if (father && !father.rels.children?.includes(member.id)) {
        father.rels.children?.push(member.id);
      }
    }
    if (member.motherId) {
      const mother = membersMap.get(member.motherId);
      if (mother && !mother.rels.children?.includes(member.id)) {
        mother.rels.children?.push(member.id);
      }
    }
  });

  return Array.from(membersMap.values());
}
