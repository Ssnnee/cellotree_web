"use server"

import { z } from "zod"
import { generateId } from "lucia"
import { db } from "~/server/db";
import { hash, verify } from "@node-rs/argon2";
import { lucia, validateRequest } from "~/lib/auth";
import { cookies } from "next/headers"
import { SignInSchema, SignUpSchema } from "~/types";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  const hashedPassword = await hash(values.password, {
    memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
  })

  const userId = generateId(15)

  try {
    await db.user.create({
      data:{
        id: userId,
        username: values.username,
        email: values.email,
        hashedPassword,
      },
    })

    const session = await lucia.createSession(userId, {})

    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    return {
      success: true,
      data: {
        userId,
      },
    }
  } catch (error: unknown) {
    return {
      error: "Le nom d'utilisateur est  déjà pris. Veuillez en choisir un autre ou connectez-vous.",
    }
  }
}

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  console.log(values)
  try {
    SignInSchema.parse(values)
  } catch (error: any) {
    return {
      error: error.message,
    }
  }

  const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username: values.username },
          { email: values.username },
        ]
      },
  })

  if (!existingUser) {
    return {
      error: "L'utilisateur n'existe pas, veuillez vous inscrire.",
    }
  }

  if (!existingUser.hashedPassword) {
    return {
      error: "L'utilisateur n'existe pas, veuillez vous inscrire.",
    }
  }

  const isValidPassword = await verify(
    existingUser.hashedPassword,
    values.password
  )

  if (!isValidPassword) {
    return {
      error: "Le nom d'utilisateur ou le mot de passe est incorrect",
    }
  }

  const session = await lucia.createSession(existingUser.id, {})

  const sessionCookie = lucia.createSessionCookie(session.id)

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )

  return {
    success: "Vous êtes connecté.",
  }
}

export const signOut = async () => {
  try {
    const { session } = await validateRequest()

    if (!session) {
      return {
        error: "Unauthorized",
      }
    }

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie()

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }
}

export const useUser = async () => {
  const { user } = await validateRequest()
  return user
}

