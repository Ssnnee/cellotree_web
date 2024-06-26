import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAccess: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: { id: input.id },
        include: {
          access: true
        }
      })
    }),

  getAll: publicProcedure
    .query((ctx) => {
      return ctx.ctx.db.user.findMany({
        include: {
          access: true
        }
      })
    }),

  getUserBySession: publicProcedure
    .input(z.object({ session: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.session.findFirst({
        where: { id: input.session },
        include: {
          user: true
        }
      })
    }),
});

