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

import { cn } from "~/lib/utils"

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

import { api } from "~/trpc/react"
import { toast } from "~/components/ui/use-toast"
import { useState } from "react"

export const formSchema = z.object({
  idSpouse: z.string().min(2, {
    message: "L'identifiant du conjoint doit contenir au moins 2 caractères.",
  }),
})

interface SpouseFormProps {
  id: string
  sex: string | null
  treeId: string
}

function calculateAge(birthdate: Date | null): number {
  if (!birthdate) return 0
  const birthDate = new Date(birthdate)
  const currentDate = new Date()
  let age = currentDate.getFullYear() - birthDate.getFullYear()
  const monthDifference = currentDate.getMonth() - birthDate.getMonth()
  if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export function SpouseForm({ id, sex, treeId }: SpouseFormProps) {
  const [spouserPopIsopen, setSpousePopIsopen] = useState(false)

  const treeMember = api.member.getManyByTreeId.useQuery({ id: treeId })

  const femaleMemberOfTree = api.member.getFemaleMembersByTreeId.useQuery({ id: treeId })
  const femaleMember = femaleMemberOfTree.data?.member
  const maleMemberOfTree = api.member.getMaleMembersByTreeId.useQuery({ id: treeId })
  const maleMember = maleMemberOfTree.data?.member

  const getMember = api.member.getById.useQuery({ id: id })
  const member = getMember.data
  console.log("member", member)

  const filteredSpouse =
    sex === 'M'
      ? femaleMember?.filter(
          (fm) =>
            calculateAge(fm.birthdate) >= 10 &&
            !member?.fatherChildren.some((child) => child.id === fm.id) &&
            !member?.spouses.some((spouse) => spouse.id === fm.id) &&
            fm.id !== member?.fatherId &&
            fm.id !== member?.motherId
        )
      : maleMember?.filter(
          (mm) =>
            calculateAge(mm.birthdate) >= 10 &&
            !member?.motherChildren.some((child) => child.id === mm.id) &&
            !member?.spouses.some((spouse) => spouse.id === mm.id) &&
            mm.id !== member?.fatherId &&
            mm.id !== member?.motherId
        )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const addSpouse = api.member.addSpouse.useMutation()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addSpouse.mutate(
      {
        membreId: id,
        parentId: values.idSpouse,
      },
      {
        onSuccess: () => {
          form.reset()
          toast({
            title: "Le conjoint a été ajouté avec succès.",
          })
          treeMember.refetch()
        },
        onError: () => {
          toast({
            variant: "destructive",
            description: "Une erreur s'est produite lors de l'ajout du conjoint.",
          })
        }
      }
    )
    console.log("values", values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="idSpouse"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Conjoint</FormLabel>
              <Popover open={spouserPopIsopen} onOpenChange={setSpousePopIsopen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? filteredSpouse?.find((m) => m.id === field.value)?.lastname +
                          " " +
                          filteredSpouse?.find((m) => m.id === field.value)?.firstname
                        : "Sélectionner un conjoint"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Recherche d&apos;un conjoint..." />
                      <CommandEmpty>
                        Aucun membre susceptible d&apos;être un conjoint trouvé.
                        Veuillez en ajouter un d&apos;abord.
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredSpouse?.map((member) => (
                          <CommandItem
                            value={member.id}
                            key={member.id}
                            onSelect={() => {
                              form.setValue("idSpouse", member.id)
                              setSpousePopIsopen(false)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                member.id === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {member.lastname + " " + member.firstname}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Le membre sélectionné sera le conjoint de ce membre. Après avoir
                appuyé sur soumettre.
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
