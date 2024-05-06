import { api } from "~/trpc/react"

export const TreeRefetchHook = () => {
  const userAccess = api.access.getByUserId.useQuery({ id: "user_2esAQpNJJFUm0VXfV5NFvVjYcfM" });
  const handleRefetch =() => { userAccess.refetch(); };

  return { userAccess, handleRefetch };
}
