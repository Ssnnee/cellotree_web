"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { Separator } from "~/components/ui/separator";
import TreeActions from "./TreeActions";

export default function Tree() {
  const { isSignedIn, user } = useUser()
  const [userID, setUserID] = useState<string>("");

  useEffect(() => {
    if (isSignedIn) {

    const userID = user.id
    setUserID(userID)
    };
  }, [isSignedIn]);

  const userAccess = api.access.getByUserId.useQuery({ id: userID });


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
                   treeType: access.tree.type
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
