import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const treeSchema = z.object({
  externalId: z.string(),
  name: z.string(),
  type: z.enum(["public", "private"]),
})

const updateTreeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["public", "private"]),
})

const idSchema = z.object({ id: z.string() });

export const treeRouter = createTRPCRouter({
  getById: publicProcedure
  .input(idSchema)
  .query(({ ctx, input }) => {
    return ctx.db.tree.findFirst({
      where: { id: input.id },
      include: {
        member: true
      }
    })
  }),

  create: publicProcedure
  .input(treeSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.tree.create({
      data: {
        name: input.name,
        type: input.type,
        userAccess: {
          create: {
            level: "admin",
            userExternalId: input.externalId,
          }
        }
      },
    });
  }),

  update: publicProcedure
  .input(updateTreeSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.tree.update({
      where: { id: input.id },
      data: {
        name: input.name,
        type: input.type,
      }
    });
  }),

  delete: publicProcedure
  .input(idSchema)
  .mutation(({ input, ctx }) => {
    return ctx.db.userAccess.delete({
      where: { id: input.id },
    });
  }),


});
