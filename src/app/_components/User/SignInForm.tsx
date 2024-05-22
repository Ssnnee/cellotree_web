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
import { toast } from "~/components/ui/use-toast"
import { useRouter } from "next/navigation"

const SignInSchema = z.object({
  username: z.string()
   .min(2, {
    message: "Le nom d'utilisateur doit contenir au moins 2 caractères.",
  })
  .max(20, {
    message: "Le nom d'utilisateur doit contenir moins de 20 caractères.",
  }),
  password: z
    .string()
    .min(8, { message: "Le mode de passe doit avoir au moins 8 charactères" }),
})


export function SignInForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SignInSchema>) {
    // const res = await signIn(values)
    // if (res.error) {
    //   toast({
    //     variant: "destructive",
    //     description: res.error,
    //   })
    // } else if (res.success) {
    //   toast({
    //     variant: "default",
    //     description: "Signed in successfully",
    //   })
    //
    //   router.push("/")
    // }

  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input placeholder="Nom d'utilisateur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Mot de passe" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">Se connecter</Button>
      </form>
    </Form>
  )
}

