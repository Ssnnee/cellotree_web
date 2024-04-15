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

import { TreeForm } from "./TreeForm";



export function CreateTreeButton() {
  return (
    <Dialog>
      <DialogTrigger >
        <Button variant="outline" className="w-full justify-center">
          <PlusIcon className="" />
        </Button>
      </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Creation d'un nouvel arbre</DialogTitle>
            <DialogDescription>
              Remplissez les champ ci-dessous pour creer un nouvel arbre
            </DialogDescription>
            <TreeForm />
          </DialogHeader>
        </DialogContent>
    </Dialog>
  );
}
