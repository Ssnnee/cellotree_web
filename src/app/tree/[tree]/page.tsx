import { api } from "~/trpc/react"

interface Params {
  params: {
    treeId: string
  }
}
export default function TreePage( { params }: Params) {
  // const getMembers = api.tree.getById.useQuery({ id: params.treeId })
  return (
    <div className="flex h-screen justify-center items-center align-middle">

    </div>
  )
}
