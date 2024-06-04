import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

import { TreeForm } from "./Tree/TreeForm";

interface CreateTreeButtonProps {
  userId: string,
  setOpened: (value: boolean) => void;
}

export function CreateTreeButton({ userId, setOpened }: CreateTreeButtonProps) {

  return (
    <Dialog>
      <DialogTrigger >
        <div className="flex flex-col justify-center items-center h-8 rounded-md px-3 text-xs hover:bg-accent hover:text-accent-foregroundborder-solid border-2 ">
          <PlusIcon className="" />
        </div>
      </DialogTrigger>
        <DialogContent className="max-w-lg ">
          <DialogHeader>
            <DialogTitle>Creation d&apos;un nouvel arbre</DialogTitle>
            <DialogDescription>
              Remplissez les champ ci-dessous pour creer un nouvel arbre
            </DialogDescription>
            <TreeForm userId={userId} setOpened={setOpened} />
          </DialogHeader>
        </DialogContent>
    </Dialog>
  );
}
