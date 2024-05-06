import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import { api } from "~/trpc/react"
import type { TreeActionsProps } from "./TreeActions"
import { TreeRefetchHook } from "./TreeRefetchHook"
import { toast } from "~/components/ui/use-toast"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom de l'arbre doit contenir au moins 2 caractères.",
  }),
  treeType: z.enum(["public", "private"]),
})

interface UpdateTreeFormProps extends TreeActionsProps {
  setDialogIsOpen: (isOpen: boolean) => void
}

export function UpdateTreeForm({treeInfo, setDialogIsOpen}: UpdateTreeFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: treeInfo.treeName,
      treeType: treeInfo.treeType,

    },
  })
  // const { isSignedIn } = useUser()
  const isSignedIn = true

  const updateTree = api.tree.update.useMutation()

  const { handleRefetch } = TreeRefetchHook()

  function onSubmit(values: z.infer<typeof formSchema>) {

    if (isSignedIn) {
      updateTree.mutate(
        {
          name: values.name,
          type: values.treeType,
          id: treeInfo.treeId,
        },
        {
          onSettled: () => {
            toast({
              title: "L'arbre a été mis à jour",
              description: "L'arbre devient : " +
                values.name + " de type " + values.treeType,
            }),
            form.reset(),
            handleRefetch(),
            setDialogIsOpen(false)
            }
        }
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;arbre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Ceci sera le nom de votre arbre.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="treeType"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Type de votre arbre</FormLabel>
                <Select onValueChange={field.onChange} >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={treeInfo.treeType}   />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Prive</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Vous pouvez choisir de laisser votre arbre être public ou privé. Vous pourrez le modifier plus tard.
                </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Modifier</Button>
      </form>
    </Form>
  )
}
