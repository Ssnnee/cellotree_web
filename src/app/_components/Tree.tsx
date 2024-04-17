import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { Separator } from "~/components/ui/separator";
import TreeActions from "./TreeActions";
import { TreeRefetchHook } from "./TreeRefetchHook";

export default function Tree() {

  const{ userAccess } = TreeRefetchHook()


  return (
    <div className="">
      {userAccess.data?.map((access, index) => (
        <div key={access.id} className="flex flex-col p-4">
          <div className="flex justify-between items-center">
            <Link href={`/tree/${access.tree.id}`} className="w-full">
             {access.tree.name}
            </Link>
            <div className="cursor-pointer">
              <TreeActions
               treeInfo={
                 {
                   treeId: access.tree.id,
                   treeName: access.tree.name,
                   treeType: access.tree.type,
                   userAccessId: access.id
                 }
               }
               refetch={userAccess.refetch}
              />
            </div>
          </div>
          {index !== userAccess.data?.length -1 && <Separator /> }
        </div>
        ))
       ?? <div> Chargement... </div> }
    </div>
  );
}
