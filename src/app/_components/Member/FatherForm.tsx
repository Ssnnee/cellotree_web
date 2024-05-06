"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { api } from "~/trpc/react"
import { toast } from "~/components/ui/use-toast"


const FormSchema = z.object({
  fatherId: z.string({
    required_error: "Veuillez choisir le parent",
  }),
})

interface FatherFormProps {
  treeId: string,
  memberId: string,
}
export function FatherForm({ treeId, memberId }: FatherFormProps ) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const maleMemberOfTree =  api.member.getMaleMembersByTreeId.useQuery({id: treeId});
  const maleMember = maleMemberOfTree.data?.member

  const getMember = api.member.getById.useQuery( {id : memberId });
  const member = getMember.data

  const getFather = api.member.getById.useQuery( { id: member?.relation?.fatherId ?? "" } )
  const father = getFather.data

  const addOrUpdateFatherMutation = api.relation.addOrUpdateFather.useMutation()


  const [open, setOpen] = useState(false)

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addOrUpdateFatherMutation.mutate(
      {
        parentId: data.fatherId,
        membreId: memberId,
      },
      {
        onSettled: () => {
          toast({
          title: "Père ajouté",
          description: "Le père ayant été ajouté est : " + father?.lastname + " " + father?.firstname,
        })
        }
      }
    )
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fatherId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Père</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}

                      defaultValue={cn(!member?.relation && `${member?.relation?.fatherId}`)}

                    >
                    {father && !field.value ?
                      father?.lastname + " " + father?.firstname :
                      field.value
                        ? maleMember?.find(
                            (fatherId) => fatherId.id === field.value
                          )?.lastname
                        : "Selectionner le père"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                    <CommandInput placeholder="Search fatherId..." />
                    <CommandEmpty>Aucun membre trouvé.</CommandEmpty>
                        <CommandGroup>
                          {maleMember?.map((member) => (
                            <CommandItem
                              value={member.id}
                              key={member.id}
                              onSelect={() => {
                                form.setValue("fatherId", member.id)
                                setOpen(false)
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  member.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {member.lastname + " " + member.firstname}
                            </CommandItem>
                          )) ?? ""}
                        </CommandGroup>
                      </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Le membre sélectionné sera le père de ce membre. Après avoir
                appuyé sur soumettre.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Soumettre</Button>
      </form>
    </Form>
    </>
  )
}
