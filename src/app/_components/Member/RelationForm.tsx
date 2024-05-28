"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import { toast } from "~/components/ui/use-toast";

const FormSchema = z.object({
  fatherId: z.string({
    required_error: "Veuillez choisir le père",
  }),
  motherId: z.string({
    required_error: "Veuillez choisir la mère",
  }),
});

interface ParentFormProps {
  treeId: string;
  memberId: string;
}

export function ParentForm({ treeId, memberId }: ParentFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const maleMemberOfTree = api.member.getMaleMembersByTreeId.useQuery({ id: treeId });
  const femaleMemberOfTree = api.member.getFemaleMembersByTreeId.useQuery({ id: treeId });
  const getMember = api.member.getById.useQuery({ id: memberId });

  const maleMember = maleMemberOfTree.data?.member;
  const femaleMember = femaleMemberOfTree.data?.member;
  const member = getMember.data;

  const fatherRelation = member?.relation?.find((relation) => relation.type === "pere");
  const getFather = api.member.getById.useQuery({ id: fatherRelation?.parentId ?? "" });
  const father = getFather.data;

  const motherRelation = member?.relation?.find((relation) => relation.type === "mere");
  const getMother = api.member.getById.useQuery({ id: motherRelation?.parentId ?? "" });
  const mother = getMother.data;

  const addParent = api.relation.addParent.useMutation();
  const deleteOldSpouse = api.relation.deleteOldSouse.useMutation();
  const deleteOldChild = api.relation.deleteOldChild.useMutation();

  const [openFather, setOpenFather] = useState(false);
  const [openMother, setOpenMother] = useState(false);

  const currentYear = new Date().getFullYear();
  const memberBirthYear = member?.birthdate ? new Date(member.birthdate).getFullYear() : currentYear;

  const filteredMaleMembers = maleMember?.filter(
    (m) => m.id !== memberId && new Date(m.birthdate || '').getFullYear() <= memberBirthYear - 10
  );

  const filteredFemaleMembers = femaleMember?.filter(
    (m) => m.id !== memberId && new Date(m.birthdate || '').getFullYear() <= memberBirthYear - 10
  );

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!father?.lastname || !mother?.lastname) {
      addParent.mutate(
        {
          membreId: memberId,
          fatherId: data.fatherId,
          motherId: data.motherId,
        },
        {
          onSettled: () => {
            toast({
              title: "Parents ajoutés",
              description:
                "Le père ajouté est : " +
                father?.lastname +
                " " +
                father?.firstname +
                " et la mère ajoutée est : " +
                mother?.lastname +
                " " +
                mother?.firstname,
            });
          },
        }
      );
    } else {
      deleteOldSpouse.mutate(
        {
          fatherId: father.id,
          motherId: mother.id,
        },
        {
          onSuccess: () => {
            deleteOldChild.mutate(
              {
                id: member?.id ?? "",
              },
              {
                onSuccess: () => {
                  addParent.mutate(
                    {
                      membreId: memberId,
                      fatherId: data.fatherId,
                      motherId: data.motherId,
                    },
                    {
                      onSettled: () => {
                        toast({
                          title: "Parents ajoutés",
                          description:
                            "Le père ajouté est : " +
                            father?.lastname +
                            " " +
                            father?.firstname +
                            " et la mère ajoutée est : " +
                            mother?.lastname +
                            " " +
                            mother?.firstname,
                        });
                      },
                    }
                  );
                },
              }
            );
          },
        }
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fatherId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Père</FormLabel>
              <Popover open={openFather} onOpenChange={setOpenFather}>
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
                      <CommandInput placeholder="Recherche d'un père..." />
                      <CommandEmpty>
                        Aucun membre susceptible d'être un père trouvé.
                        Veuillez en ajouter un d'abord.
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredMaleMembers?.map((member) => (
                          <CommandItem
                            value={member.id}
                            key={member.id}
                            onSelect={() => {
                              form.setValue("fatherId", member.id);
                              setOpenFather(false);
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

        <FormField
          control={form.control}
          name="motherId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Mère</FormLabel>
              <Popover open={openMother} onOpenChange={setOpenMother}>
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
                        ? filteredFemaleMembers?.find((m) => m.id === field.value)?.lastname
                        : "Selectionner la mère"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Recherche d'une mère..." />
                      <CommandEmpty>
                        Aucun membre susceptible d'être une mère trouvé.
                        Veuillez en ajouter un d'abord.
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredFemaleMembers?.map((member) => (
                          <CommandItem
                            value={member.id}
                            key={member.id}
                            onSelect={() => {
                              form.setValue("motherId", member.id);
                              setOpenMother(false);
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
        <Button type="submit">Soumettre</Button>
      </form>
    </Form>
  );
}

