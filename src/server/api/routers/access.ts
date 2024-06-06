import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const updateAccessSchema = z.object({
  id: z.string(),
  level: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});
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
    }),

  getAccessByTreeId: publicProcedure
   .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.userAccess.findMany({
        where: { treeId: input.id },
        include: {
          user: true
        }
      })
    }),

  create: publicProcedure
    .input(z.object({
      userId: z.string(),
      treeId: z.string(),
      accessType: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.userAccess.create({
        data: {
          userId: input.userId,
          treeId: input.treeId,
          level: input.accessType
        }
      })
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.userAccess.delete({
        where: { id: input.id }
      })
    }),

  update: publicProcedure
  .input(updateAccessSchema)
  .mutation(({ ctx, input }) => {
    return ctx.db.userAccess.update({
      where: { id: input.id },
      data: {
        level: input.level
      }
    })
  }),

});

