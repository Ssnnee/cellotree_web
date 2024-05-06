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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select"
import { MembrHook } from "./MemberHook"


const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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

  sex: z.enum(["male", "female"]),

  avatar: z.any()
    .refine((file) => file[0]?.size <= MAX_FILE_SIZE,
      { message: `Le fichier doit faire moins de 5 Mo.` }
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file[0]?.type),
      { message: "Le fichier doit être de type image." },
    ),
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
      description: "",
      placeOfBirth: "",
      treeId: treeId
    },
  })


  const createMember = api.member.create.useMutation()
  const { treeMember } = MembrHook(treeId)


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if(!values.avatar) {
      return;
    }
    const file = values.avatar[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `/api/upload?filename=${file.name}`,
        {
          method: "POST",
          body: formData
        }
      );
      if (response.ok) {
        console.log("File uploaded successfully");
        console.log(response);
      } else {
        console.error("Failed to upload file:", response.statusText);
        console.log(response);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    createMember.mutate(
     {
       firstname: values.firstName,
       lastname: values.lastName,
       birthdate: values.birthdate,
       sex: values.sex,
       placeOfBirth: values.placeOfBirth,
       avatarURL: `/${file.name}`,
       description: values.description,
       treeId: treeId,

     },
     {
       onSettled: () => {
         form.reset(),
         toast({
           title: "Le membre a été ajouté à l'arbre:",
           description: "Le membre ayant été ajouté est : " + values.lastName + " " + values.firstName,
         }),
         treeMember.refetch()
       }
     }
   )
    console.log("Form Values:", values);
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
                    <SelectItem value="male">Masculin</SelectItem>
                    <SelectItem value="female">Feminin</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Nous ne concevons pas qu'il est d'autres sex ni genre c'est de la bêtises
                  et nous ne l'encourageons pas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder=""
                    onChange={(e) => field.onChange(e.target.files)}
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
            <Button type="submit">Soumettre</Button>
      </form>
    </Form>
  )
}
