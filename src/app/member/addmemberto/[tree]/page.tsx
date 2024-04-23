import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { MemberForm } from "~/app/_components/MemberForm"


export default function AddMemberCard({ params }: { params: { tree: string } }) {
  return (
    <div className="flex flex-col h-screen justify-center items-center align-middle mx-auto">
      <Card className="">
        <CardHeader>
          <CardTitle>Ajout d&aposun membre</CardTitle>
          <CardDescription>Remplissez les champ ci-dessous.</CardDescription>
        </CardHeader>
        <CardContent>
          <MemberForm treeId={params.tree} />
        </CardContent>
        <CardFooter className="flex justify-between">
        </CardFooter>
      </Card>
    </div>
  )
}

