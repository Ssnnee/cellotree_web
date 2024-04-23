import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const memberSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  birthdate: z.date(),
  placeOfBirth: z.string(),
  avatarURL: z.string(),
  description: z.string(),
  treeId: z.string(),
})

const idSchema = z.object({ id: z.string() });

export const memberRouter = createTRPCRouter({
  getById: publicProcedure
  .input(idSchema)
  .query(({ ctx, input }) => {
    return ctx.db.member.findFirst({
      where: { id: input.id },
    })
  }),

  create: publicProcedure
  .input(memberSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.member.create({
      data: {
        firstname: input.firstname,
        lastname: input.lastname,
        birthdate: input.birthdate,
        placeOfBirth: input.placeOfBirth,
        avatarURL : input.avatarURL,
        description : input.description,

        tree: {
          connect: { id: input.treeId },
        }
      },
    });
  }),

  getMembersByTreeId: publicProcedure
  .input(idSchema)
  .query(({ ctx, input }) => {
    return ctx.db.tree.findFirst({
      where: {id: input.id},
      include: {
        member: true
      }

    })
  }),

  // update: publicProcedure
  // .input(updateTreeSchema)
  // .mutation(async ({ ctx, input }) => {
  //   return ctx.db.tree.update({
  //     where: { id: input.id },
  //     data: {
  //       name: input.name,
  //       type: input.type,
  //     }
  //   });
  // }),

  delete: publicProcedure
  .input(idSchema)
  .mutation( async({ input, ctx }) => {
    await ctx.db.relation.deleteMany({
      where: { memberId: input.id },
    })

    await ctx.db.member.deleteMany({
      where: { treeId: input.id },
    })

    return { success: true, message: "Tree and associated data deleted successfully" };
  }),


});
