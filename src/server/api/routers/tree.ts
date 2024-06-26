import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const treeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["PUBLIC", "PRIVATE"]),
})

const updateTreeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["PUBLIC", "PRIVATE"]),
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

  getAll: publicProcedure
  .query(({ ctx }) => {
    return ctx.db.tree.findMany({
      where: { type: "PUBLIC" },
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
            level: "ADMIN",
            userId: input.id,
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
  .mutation( async({ input, ctx }) => {
    await ctx.db.userAccess.deleteMany({
      where: { treeId: input.id },
    })

    await ctx.db.member.deleteMany({
      where: { treeId: input.id },
    })

    await ctx.db.tree.delete({
      where: { id: input.id },
    })

    return { success: true, message: "Tree and associated data deleted successfully" };
  }),

  getAdminOrWriter: publicProcedure
  .input(idSchema)
  .query(({ ctx, input }) => {
    return ctx.db.userAccess.findMany({
      where: {
        treeId: input.id,
        level: {
          in: ["ADMIN", "EDITOR"]
        }
      }
    })
  }),




});
