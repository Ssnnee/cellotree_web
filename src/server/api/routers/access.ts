import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const accessRouter = createTRPCRouter({
  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.userAccess.findMany({
        where: { userId: input.id },
        include: {
          tree: true
        }
      })
    })

});

