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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { useState } from "react"
import { cn } from "~/lib/utils"
import { toast } from "~/components/ui/use-toast"

const formSchema = z.object({
  userId: z.string(),
  accessType: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
})

interface MemberFormProps {
  treeId: string
}

export function AccesForm({ treeId }: MemberFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      accessType: "VIEWER",
    },
  })

  const [isOpen, setIsOpen] = useState(false)

  const userHavingAccess = api.access.getAccessByTreeId.useQuery({ id: treeId })
  const getUser = api.user.getAll.useQuery()
  const users = getUser.data ?? []

  const filteredUsers = users.filter((user) => {
    return !userHavingAccess.data?.some((access) => access.userId === user.id)
  })

  const createAccess = api.access.create.useMutation()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createAccess.mutate(
      {
        userId: values.userId,
        treeId: treeId,
        accessType: values.accessType,
      },
      {
        onSettled: () => {
          toast({
            title: "Le droit à été accordé à l'utilisateur",
            description: "L'utilisateur a reçu le role " + values.accessType,
          }),
          form.reset()
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Père</FormLabel>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? filteredUsers?.find((m) => m.id === field.value)?.username
                        : "Selectionner le l'utilisateur"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Recherche d'un utilisateur..." />
                      <CommandEmpty>
                        Aucun utilisateur trouvé. Veuillez essayer une autre.
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredUsers?.map((user) => (
                          <CommandItem
                            value={user.id}
                            key={user.id}
                            onSelect={() => {
                              field.onChange(user.id)
                              setIsOpen(false)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                user.id === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {user.username }
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                L&apos;utilisatuer selectionné se verra accorder le droit choisie
                Après avoir appuyé sur soumettre.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de droit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner le droit à accorder" />
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
        <Button type="submit">Soumettre</Button>
      </form>
    </Form>
  )
}
