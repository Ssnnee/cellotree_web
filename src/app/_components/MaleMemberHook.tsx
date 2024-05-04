import { api } from "~/trpc/react"

export const MaleMembrHook = ( treeId : string) => {

  const maleMemberOfTree =  api.member.getMaleMembersByTreeId.useQuery({id: treeId});

  return { maleMemberOfTree };

}
