// import { api } from "~/trpc/react"
//
// interface Params {
//   params: {
//     treeId: string
//   }
// }
// export default function TreePage( { params }: Params) {
//   // const getMembers = api.tree.getById.useQuery({ id: params.treeId })
//   return (
//     <div className="flex h-screen justify-center items-center align-middle">
//
//     </div>
//   )
// }

import { Button } from "~/components/ui/button"
import { Member, columns } from "./columns"
import { DataTable } from "./data-table"
import { PlusIcon } from "@radix-ui/react-icons"
import { CreateMemberButton } from "~/app/_components/CreateMemberButton"
import { MemberForm } from "~/app/_components/MemberForm"

async function getData(): Promise<Member[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date("1990-01-01"),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    {
      id: "728ed52f",
      firstname: "John",
      lastname: "Doe",
      birthdate: new Date(),
      placeOfBirth: "New York",
      relation: [],
      treeId: "728ed52f",
    },
    // ...
  ]
}

export default async function DemoPage( { params }: { params: { tree: string } } ) {
  const data = await getData()

  return (
    <div className="flex flex-col h-screen justify-center items-center align-middle">
      <div className="w-full flex items-center justify-between">
        <a href={`/member/addmemberto/${params.tree}`}>Add Member</a>
      </div>
      <br />
      <DataTable columns={columns} data={data} />
    </div>
  )
}

