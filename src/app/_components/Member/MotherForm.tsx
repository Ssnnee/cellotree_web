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


const FormSchema = z.object({
  motherId: z.string({
    required_error: "Veuillez choisir le parent",
  }),
})

interface MotherFormProps {
  treeId: string,
  memberId: string,
}
export function MotherForm({ treeId, memberId }: MotherFormProps ) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const femaleMemberOfTree =  api.member.getFemaleMembersByTreeId.useQuery({id: treeId});
  const femaleMember = femaleMemberOfTree.data?.member

  const getMember = api.member.getById.useQuery( {id : memberId });
  const member = getMember.data

  const getMother = api.member.getById.useQuery( { id: member?.relation?.motherId ?? "" } )
  const mother = getMother.data

  const addOrUpdateMotherMutation = api.relation.addOrUpdateMother.useMutation()


  const [open, setOpen] = useState(false)

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addOrUpdateMotherMutation.mutate(
      {
        parentId: data.motherId,
        membreId: memberId,
      },
    )
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="motherId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Mère</FormLabel>
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

                      defaultValue={cn(!member?.relation && `${member?.relation?.motherId}`)}

                    >
                    {mother && !field.value ?
                      mother?.lastname + " " + mother?.firstname :
                      field.value
                        ? femaleMember?.find(
                            (motherId) => motherId.id === field.value
                          )?.lastname
                        : "Selectionner la mère"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                    <CommandInput placeholder="Search motherId..." />
                    <CommandEmpty>Aucun membre trouvé.</CommandEmpty>
                        <CommandGroup>
                          {femaleMember?.map((member) => (
                            <CommandItem
                              value={member.id}
                              key={member.id}
                              onSelect={() => {
                                form.setValue("motherId", member.id)
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
                Le membre sélectionné sera la mère de ce membre. Après avoir
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

