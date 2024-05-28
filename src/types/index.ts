import { z } from "zod"

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

export const SignInSchema = z.object({
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
