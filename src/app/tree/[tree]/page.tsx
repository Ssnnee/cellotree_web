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

import { Member, columns } from "./columns"
import { DataTable } from "./data-table"

interface Params {
  params: {
    treeId: string
  }
}
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

export default async function DemoPage( { params }: Params) {
  const data = await getData()

  return (
    <div className="flex flex-col h-screen justify-center items-center align-middle">
      <div className="">
        <h1>Tree {params.treeId}</h1>
      </div>
      <br />
      <DataTable columns={columns} data={data} />
    </div>
  )
}

