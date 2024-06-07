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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import { api } from "~/trpc/react"
import { toast } from "~/components/ui/use-toast"


const formSchema = z.object({
  id: z.string().min(2, {
    message: "Le nom de l'arbre doit contenir au moins 2 caractères.",
  }),
  level: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
})

interface UpdateAccesFormProps {
  id: string | undefined
  level: "ADMIN" | "EDITOR" | "VIEWER" | undefined
}

export function UpdateAccesForm({id, level}: UpdateAccesFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: id,
      level: level,
    },
  })

  const updateAccess = api.access.update.useMutation()

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id || !level) return
    updateAccess.mutate(
      {
        id: id,
        level: values.level,
      },
      {
        onSuccess: () => {
          toast({
            title: "L'accès a été modifié",
            description: "L'utilisateur a maintenant l'accès" +
              values.level
          }),
          form.reset()
        },
        onError: () => {
          toast({
            title: "Erreur",
            description: "L'accès n'a pas pu être modifié",
            variant: "destructive"
          })
        }
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
          <FormItem>
            <FormLabel>Type de droit</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={level} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ADMIN">Droit d&pos;administrer</SelectItem>
                <SelectItem value="EDITOR">Droit de modifier</SelectItem>
                <SelectItem value="VIEWER">Droit de voir l&pos;arbre</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Accorder un droit à un utilisateur sur un arbre lui permettra
              de collaborer avec vous dans la reconstruction de votre arbre.
              Ces droits peuvent être modifiés plus tard.
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
