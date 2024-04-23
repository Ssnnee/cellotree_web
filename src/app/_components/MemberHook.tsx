import { api } from "~/trpc/react"

export const MembrHook = ( treeId : string) => {

  const treeMember =  api.member.getMembersByTreeId.useQuery({id: treeId});
  const handleRefetch =() => { treeMember.refetch(); };

  return { treeMember, handleRefetch };

}
