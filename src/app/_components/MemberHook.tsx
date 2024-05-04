import { api } from "~/trpc/react"

export const MembrHook = ( treeId : string) => {

  const treeMember =  api.member.getMembersByTreeId.useQuery({id: treeId});

  return { treeMember };

}
