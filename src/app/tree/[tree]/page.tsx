import MemberDataTable from "~/app/_components/Member"
import { Button } from "~/components/ui/button"


export default function  TreePage( { params }: { params: { tree: string } } ) {

  return (
    <div className="flex flex-col h-screen justify-center items-center align-middle">
      <div className="w-full flex items-center justify-between">
        <Button>
          <a href={`/member/addmemberto/${params.tree}`}>Ajouter un membre</a>
        </Button>
      </div>
      <br />

      <MemberDataTable treeId={params.tree}  />

    </div>
  )
}

