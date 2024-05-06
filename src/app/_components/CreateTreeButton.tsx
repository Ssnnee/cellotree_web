import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

import { TreeForm } from "./Tree/TreeForm";
import { useState } from "react";


export function CreateTreeButton() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger >
        <Button variant="outline" className="w-full justify-center">
          <PlusIcon className="" />
        </Button>
      </DialogTrigger>
        <DialogContent className="max-w-lg ">
          <DialogHeader>
            <DialogTitle>Creation d&apos;un nouvel arbre</DialogTitle>
            <DialogDescription>
              Remplissez les champ ci-dessous pour creer un nouvel arbre
            </DialogDescription>
            <TreeForm setDialogIsOpen={setDialogIsOpen} />
          </DialogHeader>
        </DialogContent>
    </Dialog>
  );
}
