"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { Separator } from "~/components/ui/separator";

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
        <div key={access.id} className="flex flex-col">
          <Link href={`/tree/${access.tree.id}`} className="">
            <h1>{access.tree.name}</h1>
          </Link>
          {index !== userAccess.data?.length -1 && <Separator /> }
        </div>
        ))
       ?? <div> Chargement... </div> }
    </div>
  );
}


