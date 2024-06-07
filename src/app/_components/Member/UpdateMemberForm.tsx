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

import { Input } from "~/components/ui/input"

import { api } from "~/trpc/react"
import { Textarea } from "~/components/ui/textarea"
import { toast } from "~/components/ui/use-toast"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "~/components/ui/calendar"
import { format } from "date-fns"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select"


export const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  birthdate: z.date(),
  placeOfBirth: z.string().min(2, {
    message: "Le lieu de naissance  doit contenir au moins 2 caractères.",
  }),

  sex: z.enum(["M", "F"]),

  description: z.string().min(7, {
    message: "La decription doit contenir au moins 7 caractères.",
  }).max(80, {
    message: "Votre description est trop elle ne doit pas dépasser 80 caractères."
  }),
  treeId: z.string(),
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
})

interface MemberFormProps {
  treeId: string,
  member: {
    birthdate: Date | null;
    placeOfBirth: string | null;
    sex: "M" | "F"  | null;
    description: string | null;
    treeId: string;
    id: string;
    firstname: string | null;
    lastname: string;
    avatarURL: string | null;
    fatherId: string | null;
    motherId: string | null;
  }
  setDialogIsOpen: (isOpen: boolean) => void
}

export function UpdateMemberForm( props : MemberFormProps) {
  const [motherPopIsopen, setmotherPopIsopen] = useState(false)
  const [fatherPopIsopen, setFatherPopIsopen] = useState(false)

  const treeMember = api.member.getManyByTreeId.useQuery({ id: props.treeId })

  const femaleMemberOfTree =  api.member.getFemaleMembersByTreeId.useQuery({id: props.treeId});
  const femaleMember = femaleMemberOfTree.data?.member
  const maleMemberOfTree =  api.member.getMaleMembersByTreeId.useQuery({id: props.treeId});
  const maleMember = maleMemberOfTree.data?.member

  const getMember = api.member.getById.useQuery( {id : props.member.id });
  const member = getMember.data

  const mother = member?.mother
  const father = member?.father

  const currentYear = new Date().getFullYear();
  const memberBirthYear = member?.birthdate ? new Date(member.birthdate).getFullYear() : currentYear;

  const filteredFemaleMembers = femaleMember?.filter(
    (m) => m.id !== props.member.id && new Date(m.birthdate ?? '').getFullYear() <= memberBirthYear - 10
  );
  const filteredMaleMembers = maleMember?.filter(
    (m) => m.id !== props.member.id && new Date(m.birthdate ?? '').getFullYear() <= memberBirthYear - 10
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: props.member.firstname ?? "",
      lastName: props.member.lastname,
      birthdate: new Date(props.member.birthdate ?? ""),
      sex: props.member.sex ?? "M",
      placeOfBirth: props.member.placeOfBirth ?? "",
      description: props.member.description ?? "",
      treeId: props.treeId,
    },
  })

  const updateMember = api.member.update.useMutation()

  const onSubmit = (values: z.infer<typeof formSchema>) => {

    updateMember.mutate(
     {
       description: values.description,
       treeId: values.treeId,
       id: props.member.id,
       sex: values.sex,
       birthdate: values.birthdate,
       placeOfBirth: values.placeOfBirth,
       lastname: values.lastName,
       firstname: values.firstName,
       fatherId: values.fatherId,
       motherId: values.motherId,
     },
     {
       onSettled: () => {
         form.reset(),
         toast({
           title: "Le membre a été mis à jour:",
         }),
         treeMember.refetch()
         props.setDialogIsOpen(false)
       }
     }
   )
  console.log("values", values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="sm:grid md:grid-cols-2 gap-4" >
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénoms </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de naissance</FormLabel>
                <br />
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Choisissez une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        defaultMonth={new Date(2000, 0)}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormDescription>
                  Une fois que vous avez cliquez sur une des flèche
                  , vous pouvez maintenir la touche Enter pour aller plus vite
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="placeOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu de naissance</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner le sex du membre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">Masculin</SelectItem>
                    <SelectItem value="F">Feminin</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Nous ne concevons pas qu&apos;il est d&apos;autres sex ni genre c&apos;est de la bêtises
                  et nous ne l&apos;encourageons pas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                  placeholder="Dites nous un peu plus sur ce membre"
                  className="resize-none"
                  {...field}
                />
                </FormControl>
                <FormDescription>
                  Vous pouvez renseigner ici une description bref de la personne.
                  Comme son métier, et un petit fait historique si posible.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="motherId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Mère</FormLabel>
              <Popover open={motherPopIsopen} onOpenChange={setmotherPopIsopen}>
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
                      {mother && !field.value
                        ? mother?.lastname + " " + mother?.firstname
                        : field.value
                        ? filteredFemaleMembers?.find((m) => m.id === field.value)!.lastname
                        : "Selectionner la mère"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Recherche d&apos;une mère..." />
                      <CommandEmpty>
                        Aucun membre susceptible d&apos;être une mère trouvé.
                        Veuillez en ajouter un d&apos;abord.
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredFemaleMembers?.map((member) => (
                          <CommandItem
                            value={member.id}
                            key={member.id}
                            onSelect={() => {
                              form.setValue("motherId", member.id);
                              setmotherPopIsopen(false);
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
                Le membre sélectionné sera la mère de ce membre. Après avoir
                appuyé sur soumettre.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fatherId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Père</FormLabel>
              <Popover open={fatherPopIsopen} onOpenChange={setFatherPopIsopen}>
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
                      {father && !field.value
                        ? father?.lastname + " " + father?.firstname
                        : field.value
                        ? filteredMaleMembers?.find((m) => m.id === field.value)?.lastname
                        : "Selectionner le père"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Recherche d&apos;un père..." />
                      <CommandEmpty>
                        Aucun membre susceptible d&apos;être un père trouvé.
                        Veuillez en ajouter un d&apos;abord.
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredMaleMembers?.map((member) => (
                          <CommandItem
                            value={member.id}
                            key={member.id}
                            onSelect={() => {
                              form.setValue("fatherId", member.id);
                              setFatherPopIsopen(false);
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
  )
}

