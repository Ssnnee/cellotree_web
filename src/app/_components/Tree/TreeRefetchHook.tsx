import { api } from "~/trpc/react"
import { useUser } from "../auth-provider";

export const TreeRefetchHook = () => {
  const { user } = useUser()

  if (!user) {
    return { userAccess: null, handleRefetch: null };
  }
  const userAccess = api.access.getByUserId.useQuery({ id: user.id});
  const handleRefetch =() => { userAccess.refetch(); };

  return { userAccess, handleRefetch };
}
