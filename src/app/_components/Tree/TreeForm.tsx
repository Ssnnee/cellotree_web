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
import { toast } from "~/components/ui/use-toast"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom de l&apos;arbre doit contenir au moins 2 caractères.",
  }),
  treeType: z.enum(["PUBLIC", "PRIVATE"]),
})

interface TreeFormProps {
  userId: string,
  setOpened: (isOpen: boolean) => void
}

export function TreeForm({ userId, setOpened }: TreeFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const createTree = api.tree.create.useMutation()

  function onSubmit(values: z.infer<typeof formSchema>) {
    createTree.mutate(
      {
        name: values.name,
        type: values.treeType,
        id: userId,
      },
      {
        onSettled: () => {
          toast({
            title: "L'arbre a été créé.",
            description: "L'arbre ayant été créé est : " +
              values.name + " de type " + values.treeType,
          }),
          form.reset(),
          setOpened(false),
          router.push("/")
        }
      }
    )
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
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVATE">Privé</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Vous pouvez choisir de laisser votre arbre être PUBLIC ou privé. Vous pourrez le modifier plus tard.
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

