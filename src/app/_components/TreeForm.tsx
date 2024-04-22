"use client"

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

import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react"
import { TreeRefetchHook } from "./TreeRefetchHook"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom de l&apos;arbre doit contenir au moins 2 caractères.",
  }),
  treeType: z.enum(["public", "private"]),
})

interface TreeFormProps {
  setDialogIsOpen: (isOpen: boolean) => void
}

export function TreeForm({ setDialogIsOpen }: TreeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const { isSignedIn, user } = useUser()

  const createTree = api.tree.create.useMutation()

  const { handleRefetch } = TreeRefetchHook()

  function onSubmit(values: z.infer<typeof formSchema>) {

    if (isSignedIn) {
      createTree.mutate(
        {
          name: values.name,
          type: values.treeType,
          externalId: user.id,
        },
        {
          onSettled: () => {
            form.reset(),
              handleRefetch()
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
                <Input placeholder="" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner le Type de l&apos;arbre" />
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
        <Button type="submit">Soumettre</Button>
      </form>
    </Form>
  )
}

