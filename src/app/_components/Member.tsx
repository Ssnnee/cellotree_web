"use client"

import { MembrHook } from "./MemberHook";
import { DataTable } from "../tree/[tree]/data-table";
import { columns } from "../tree/[tree]/columns";

interface MemberProps {
  treeId: string
}

export default function MemberDataTable( { treeId } :  MemberProps) {

  const { treeMember } = MembrHook(treeId)
  const member = treeMember.data?.member

  return (
    <div className="">
      {member ? (
        <DataTable columns={columns} data={member} />
      ) : (
        <div>Chargement...</div>
      )}
    </div>
  );
}
