import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react"

export const TreeRefetchHook = () => {
  const { isSignedIn, user } = useUser()
  const [userID, setUserID] = useState<string>("");

  useEffect(() => {
    if (isSignedIn) {

    const userID = user.id
    setUserID(userID)
    };
  }, [isSignedIn, user]);

  const userAccess = api.access.getByUserId.useQuery({ id: userID });
  const handleRefetch =() => { userAccess.refetch(); };

  return { userAccess, handleRefetch };

}
