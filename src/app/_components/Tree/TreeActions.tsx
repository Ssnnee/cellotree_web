import { useState } from "react"
import { AccessibilityIcon, CheckIcon, ClipboardIcon, DotsHorizontalIcon, EyeOpenIcon, Pencil1Icon, Share1Icon, TrashIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"

import { UpdateTreeForm } from "./UpdateTreeForm"
import { api } from "~/trpc/react"
import {  } from "@radix-ui/react-tooltip"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent
} from "~/components/ui/tooltip"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { toast } from "~/components/ui/use-toast"
import Link from "next/link"

export interface TreeActionsProps {
  treeInfo: {
    treeId: string
    treeName: string
    treeType: "PRIVATE" | "PUBLIC"
  },
  refetch: () => void;
  accessLevel?: string;
}
export default function TreeActions({ treeInfo, refetch, accessLevel }: TreeActionsProps) {
  const [alertDialogIsOpen, setAlertDialogIsOpen] = useState(false)
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [dialogIsOpen1, setDialogIsOpen1] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const isAuthorised = accessLevel === "ADMIN" || accessLevel === "EDITOR";
  const isAdmin = accessLevel === "ADMIN";

  const deleteTree = api.tree.delete.useMutation()

  const treeUrl = `http://localhost:3000/chart/${treeInfo.treeId}`

  const handleDelete = async () => {
    deleteTree.mutate(
      { id: treeInfo.treeId },
      {
        onSettled: () => {
          toast({
            title: "L'arbre a été supprimé",
          }),
          refetch()
        }
      }
    )
  }

  const handleCopy = async () => {
    navigator.clipboard.writeText(treeUrl)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <DotsHorizontalIcon />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Share1Icon className="mr-2 h-3.5 w-3.5" />
            <span className="text-sm" onClick={() => setDialogIsOpen1(true)}>Partager l&apos;arbre</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EyeOpenIcon className="mr-2 h-3.5 w-3.5" />
            <Link href={`/view/${treeInfo.treeId}`}> Visualiser l&apos;arbre </Link>
          </DropdownMenuItem>

          {isAuthorised &&
            <>
              <DropdownMenuSeparator />
              {isAdmin &&
                <DropdownMenuItem>
                  <AccessibilityIcon className="mr-2 h-3.5 w-3.5" />
                  <Link href={`/access/${treeInfo.treeId}`}> Accorder un accès </Link>
                </DropdownMenuItem>
              }
              <DropdownMenuItem>
                <Pencil1Icon className="mr-2 h-3.5 w-3.5" />
                <span onClick={() => setDialogIsOpen(true)}>Modifier l&apos;arbre</span>
              </DropdownMenuItem>
              {isAdmin &&
                <DropdownMenuItem className="text-red-600">
                  <TrashIcon className="mr-2 h-3.5 w-3.5" />
                  <span onClick={() => setAlertDialogIsOpen(true)} >
                      Supprimer l&apos;arbre
                  </span>
                </DropdownMenuItem>
              }
            </>
          }
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={alertDialogIsOpen} onOpenChange={setAlertDialogIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Etes-vous sûr de vouloir supprimer cet arbre? </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne pourra pas etre annulé
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modification de l&apos;arbre</DialogTitle>
            <DialogDescription>
              Remplissez les champ ci-dessous pour modifier cet arbre
            </DialogDescription>
            <UpdateTreeForm
              treeInfo={treeInfo}
              refetch={refetch}
              setDialogIsOpen={setDialogIsOpen}
            />
          </DialogHeader>
        </DialogContent>
    </Dialog>
        <Dialog open={dialogIsOpen1} onOpenChange={setDialogIsOpen1}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Partage de l&apos;arbre {treeInfo.treeName } </DialogTitle>
              <DialogDescription>
                Vous pouvez copiez puis partager le lien dans une plateforme de votre choix
              </DialogDescription>
              <div className="flex items-center justify-center gap-4">
                <Input className="max-w-sm" value={treeUrl} role="note"  />
                <Button variant="outline" onClick={handleCopy}>
                { !isCopied ? <ClipboardIcon /> : <CheckIcon /> }
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
    </>
  )
}
