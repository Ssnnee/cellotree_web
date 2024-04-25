import Link from "next/link";

import { Separator } from "~/components/ui/separator";
import TreeActions from "./TreeActions";
import { TreeRefetchHook } from "./TreeRefetchHook";
import { useState } from "react";

export default function Tree() {

  const{ userAccess } = TreeRefetchHook()
  const [ isClicked, setIsClicked ] = useState<string | null>(null)


  return (
    <div className="">
      {userAccess.data?.map((access, index) => (
        <div key={access.id} className="flex flex-col">
          <div
            className={`flex justify-between items-center rounded p-2
              hover:bg-accent hover:text-accent-foreground
              ${isClicked === access.id && "bg-accent text-accent-foreground"}`}
            onClick={() => setIsClicked(isClicked === access.id ? null : access.id)}
          >
            <Link href={`/tree/${access.tree.id}`} className="w-full ">
             {access.tree.name}
            </Link>
            <div className="cursor-pointer">
              <TreeActions
               treeInfo={
                 {
                   treeId: access.tree.id,
                   treeName: access.tree.name,
                   treeType: access.tree.type,
                 }
               }
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
