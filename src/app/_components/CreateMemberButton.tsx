import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

export function CreateMemberButton() {

  return (
    <Dialog>
      <DialogTrigger>
          <PlusIcon className="" />
      </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajout d&apos;un nouveau membre</DialogTitle>
            <DialogDescription>
              Remplissez les champ ci-dessous pour creer un nouvel arbre
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
    </Dialog>
  );
}
