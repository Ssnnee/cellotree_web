import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const perentSchema = z.object({
  membreId: z.string(),
  parentId: z.string(),
})

const idSchema = z.object({ id: z.string() });

export const relationRouter = createTRPCRouter({
  getById: publicProcedure
  .input(idSchema)
  .query(({ ctx, input }) => {
    return ctx.db.relation.findFirst({
      where: { memberId: input.id },
    })
  }),

  addOrUpdateFather: publicProcedure
  .input(perentSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.relation.upsert({
      where: { memberId: input.membreId },
      create: {
        member: {
          connect: { id: input.membreId },
        },
        fatherId: input.parentId,
      },
      update: {
        fatherId: input.parentId,
      }
    })
  }),

  addOrUpdateMother: publicProcedure
  .input(perentSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.relation.upsert({
      where: { memberId: input.membreId },
      create: {
        member: {
          connect: { id: input.membreId },
        },
        motherId: input.parentId,
      },
      update: {
        motherId: input.parentId,
      }
    })
  }),


});
