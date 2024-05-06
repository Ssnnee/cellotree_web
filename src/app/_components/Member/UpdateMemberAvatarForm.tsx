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

import { Input } from "~/components/ui/input"

import { api } from "~/trpc/react"
import { toast } from "~/components/ui/use-toast"
import { useState } from "react"
import { MembrHook } from "./MemberHook"


const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const formSchema = z.object({
  avatar: z.any()
    .refine((file) => file[0]?.size <= MAX_FILE_SIZE,
      { message: `Le fichier doit faire moins de 5 Mo.` }
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file[0]?.type),
      { message: "Le fichier doit être de type image." },
    ),
  treeId: z.string()
})

interface MemberFormProps {
  treeId: string,
  member: {
    birthdate: Date | null;
    placeOfBirth: string | null;
    sex: "male" | "female"  | null;
    description: string | null;
    treeId: string;
    id: string;
    firstname: string | null;
    lastname: string;
    avatarURL: string | null;
  }
  setDialogIsOpen: (isOpen: boolean) => void
}

export function UpdateMemberAvatarForm( props : MemberFormProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      treeId: props.treeId,
    },
  })


  const updateMember = api.member.updateAvatar.useMutation()
  const { treeMember } = MembrHook(props.treeId)
  const  [iShidden, setHidden] = useState(false)


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

    try {
      formData.append('path', props.member.avatarURL ?? "");

      const response = await fetch(
        `/api/upload?filename=${file.name}`,
      {
        method: 'DELETE',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Delection", data);
      } else {
        console.error('Failed to delete file:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    updateMember.mutate(
     {
       id: props.member.id,
       avatarURL: values.avatar,
     },
     {
       onSettled: () => {
         form.reset(),
         toast({
           title: "L'avatar d'un membre a été mis à jour:",
         }),
         setHidden(true)
         treeMember.refetch()
         props.setDialogIsOpen(false)
       }
     }
   )
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="" >
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
            {/*  <Button variant={"outline"} onClick={() => form.reset()}>Annuler</Button> */}
            <br/>
            <Button type="submit">Soumettre</Button>
          <h1 className={iShidden ? "" : "hidden"}>Membre ajouté</h1>
      </form>
    </Form>
  )
}

