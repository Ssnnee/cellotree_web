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
import { signUp } from "../../../actions/auth.actions"

export const SignUpSchema = z.object({
  username: z.string()
  .min(2, {
    message: "Le nom d'utilisateur doit contenir au moins 2 caractères.",
  })
  .max(20, {
    message: "Le nom d'utilisateur doit contenir moins de 20 caractères.",
  }),
  email: z.string().email({ message: "L'email n'est pas valide" }),
  password: z.string()
  .min(8, { message: "Le mode de passe doit avoir au moins 8 charactères" }),
  confirmPassword: z
  .string()
  .min(8, { message: "Le mode de passe doit avoir au moins 8 charactères" }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Le mot de passe ne correspond pas",
  path: ["confirmPassword"],
})


export function SignUpForm() {

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    const res = await signUp(values)
    if (res.error) {
      toast({
        variant: "destructive",
        description: res.error,
      })
    } else if (res.success) {
      toast({
        variant: "default",
        description: "Compter créer avec succès",
      })

      // router.push("/")
    }

      form.reset()
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
              <FormDescription>
                Ceci sera le nom avec lequel vous vous connecterez.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input type="email" placeholder="Adresse électronique" {...field} />
              </FormControl>
              <FormDescription>
                Vous pourriez utiliser cette adresse pour réinitialiser votre mot de passe ou vous connecter.
              </FormDescription>
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Confirmer le mot de passe" type="password" {...field} />
              </FormControl>
              <FormDescription>
               Entrer le même mot de passe
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">Creer un compte</Button>
      </form>
    </Form>
  )
}

