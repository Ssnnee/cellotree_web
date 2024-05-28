import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const parentSchema = z.object({
  membreId: z.string(),
  fatherId: z.string(),
  motherId: z.string(),
});

const deleteOldSpouseSchema = z.object({
  fatherId: z.string(),
  motherId: z.string(),
});

const idSchema = z.object({ id: z.string() });

export const relationRouter = createTRPCRouter({
  getById: publicProcedure
    .input(idSchema)
    .query(({ ctx, input }) => {
      return ctx.db.relation.findFirst({
        where: { memberId: input.id },
      });
    }),

  addParent: publicProcedure
    .input(parentSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (prisma) => {
        // Supprimer les anciennes relations "pere" et "mere"
        await prisma.relation.deleteMany({
          where: {
            memberId: input.membreId,
            type: { in: ["pere", "mere"] },
          },
        });

        // Ajouter ou mettre à jour le père
        await prisma.relation.upsert({
          where: { memberId_type: { memberId: input.membreId, type: "pere" } },
          create: {
            memberId: input.membreId,
            type: "pere",
            parentId: input.fatherId,
          },
          update: {
            parentId: input.fatherId,
          },
        });

        // Ajouter ou mettre à jour la mère
        await prisma.relation.upsert({
          where: { memberId_type: { memberId: input.membreId, type: "mere" } },
          create: {
            memberId: input.membreId,
            type: "mere",
            parentId: input.motherId,
          },
          update: {
            parentId: input.motherId,
          },
        });

        // Supprimer les anciennes relations "conjoint"
        await prisma.relation.deleteMany({
          where: {
            memberId: { in: [input.fatherId, input.motherId] },
            type: "conjoint",
          },
        });

        // Ajouter les nouvelles relations "conjoint"
        await prisma.relation.create({
          data: {
            memberId: input.fatherId,
            type: "conjoint",
            spouseId: input.motherId,
          },
        });

        await prisma.relation.create({
          data: {
            memberId: input.motherId,
            type: "conjoint",
            spouseId: input.fatherId,
          },
        });

        // Supprimer les anciennes relations "enfant"
        await prisma.relation.deleteMany({
          where: {
            memberId: { in: [input.fatherId, input.motherId] },
            type: "enfant",
            childId: input.membreId,
          },
        });

        // Ajouter les nouvelles relations "enfant"
        await prisma.relation.create({
          data: {
            memberId: input.fatherId,
            type: "enfant",
            childId: input.membreId,
          },
        });

        await prisma.relation.create({
          data: {
            memberId: input.motherId,
            type: "enfant",
            childId: input.membreId,
          },
        });
      });

      return ctx.db.relation.findFirst({
        where: { memberId: input.membreId },
      });
    }),

  deleteOldSouse: publicProcedure
    .input(deleteOldSpouseSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.relation.deleteMany({
        where: {
          memberId: { in: [input.fatherId, input.motherId] },
          type: "conjoint",
        },
      });
    }),

  deleteOldChild: publicProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.relation.deleteMany({
        where: {
          memberId: input.id,
          type: "enfant",
        },
      });
    }),
});

