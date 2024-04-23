import Member from "~/app/_components/Member"


export default function  TreePage( { params }: { params: { tree: string } } ) {

  return (
    <div className="flex flex-col h-screen justify-center items-center align-middle">
      <div className="w-full flex items-center justify-between">
        <a href={`/member/addmemberto/${params.tree}`}>Add Member</a>
      </div>
      <br />

      <Member treeId={params.tree}  />

    </div>
  )
}

