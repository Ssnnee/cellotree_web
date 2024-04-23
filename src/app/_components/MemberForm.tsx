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

import { Input } from "~/components/ui/input"

import { api } from "~/trpc/react"
import { Textarea } from "~/components/ui/textarea"
import { toast } from "~/components/ui/use-toast"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "~/components/ui/calendar"
import { format } from "date-fns"
import { useState } from "react"

// const MAX_FILE_SIZE = 5000000;
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  // avatarURL: z
  //   .any()
  //   .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
  //   .refine(
  //     (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
  //     "Veuillez uniquement choisir un fichier .jpg, .jpeg, .png and .webp "
  //   )

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

  avatarURL: z
    .string(),
  description: z.string().min(7, {
    message: "La decription doit contenir au moins 7 caractères.",
  }).max(80, {
    message: "Votre description est trop elle ne doit pas dépasser 80 caractères."
  }),
  treeId: z.string()
})

interface MemberFormProps {
  treeId: string
}

export function MemberForm({ treeId }: MemberFormProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      avatarURL: "",
      description: "",
      placeOfBirth: "",
      treeId: treeId
    },
  })

  const createMember = api.member.create.useMutation()
  const  [iShidden, setHidden] = useState(false)

  function onSubmit(values: z.infer<typeof formSchema>) {

    createMember.mutate(
     {
       firstname: values.firstName,
       lastname: values.lastName,
       birthdate: values.birthdate,
       placeOfBirth: values.placeOfBirth,
       avatarURL: values.avatarURL,
       description: values.description,
       treeId: treeId,

     },
     {
       onSettled: () => {
         form.reset(),
         toast({
           title: "Le membre a été ajouté:",
           description: (
             <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
               <code className="text-white">{JSON.stringify(values, null, 2)}</code>
             </pre>
           ),
         }),
         setHidden(true)
       }
     }
   )
    console.log("Form Values:", values);
  }

  // const fileRef = useRef<HTMLInputElement>(null);


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
            name="avatarURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input type="file" placeholder="" {...field} />
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
            <Button variant="outline">
              <a href={`/tree/${treeId}`}>Retour</a>
            </Button>
            {/*  <Button variant={"outline"} onClick={() => form.reset()}>Annuler</Button> */}
            <Button type="submit">Soumettre</Button>
          <h1 className={iShidden ? "" : "hidden"}>Membre ajouté</h1>
      </form>
    </Form>
  )
}
