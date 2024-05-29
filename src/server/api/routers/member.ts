import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const memberSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  birthdate: z.date(),
  sex: z.enum(["M", "F"]),
  placeOfBirth: z.string(),
  avatarURL: z.string().optional(),
  description: z.string(),
  treeId: z.string(),
})

const updateMemberSchema = memberSchema.extend({
  id: z.string(),
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
})
const addParentSchema = z.object({ parentId: z.string(), membreId: z.string() })


const idSchema = z.object({ id: z.string() });
const updateAvatarMemberSchema = idSchema.extend({ avatarURL: z.string()})

export const memberRouter = createTRPCRouter({
  getById: publicProcedure
  .input(idSchema)
  .query(({ ctx, input }) => {
    return ctx.db.member.findFirst({
      where: { id: input.id },
      include: {
        father: true,
        mother: true,
        spouses: true,
      }
    })
  }),

  getManyByTreeId: publicProcedure
  .input(idSchema)
  .query(({ ctx, input }) => {
    return ctx.db.member.findMany({
      where: { treeId: input.id },
      include: {
        father: true,
        mother: true,
        spouses: true,
      }
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
        sex: input.sex,
        placeOfBirth: input.placeOfBirth,
        avatarURL: input.avatarURL,
        description: input.description,

        tree: {
          connect: { id: input.treeId },
        }
      },
    });
  }),

  addFather: publicProcedure
  .input(addParentSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.member.update({
      where: { id: input.membreId },
      data: { fatherId : input.parentId }
    });
  }),

  addMother: publicProcedure
  .input(addParentSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.member.update({
      where: { id: input.membreId },
      data: { fatherId : input.parentId }
    });
  }),


  getMembersByTreeId: publicProcedure
  .input(idSchema)
  .query(({ ctx, input }) => {
    return ctx.db.tree.findFirst({
      where: { id: input.id },
      include: {
        member: true
      },
    })
  }),

  getMaleMembersByTreeId: publicProcedure
  .input(idSchema)
  .query(({ ctx, input }) => {
    return ctx.db.tree.findFirst({
      where: { id: input.id },
      include: {
        member: {
          where: { sex: "M" },
        }
      }
    })
  }),

  getFemaleMembersByTreeId: publicProcedure
  .input(idSchema)
  .query(({ ctx, input }) => {
    return ctx.db.tree.findFirst({
      where: { id: input.id },
      include: {
        member: {
          where: { sex: "F" },
        }
      }
    })
  }),

  update: publicProcedure
  .input(updateMemberSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.member.update({
      where: { id: input.id },
      data: {
        firstname: input.firstname,
        lastname: input.lastname,
        birthdate: input.birthdate,
        sex: input.sex,
        placeOfBirth: input.placeOfBirth,
        description: input.description,
        fatherId: input.fatherId,
        motherId: input.motherId,
      }
    });
  }),

  updateAvatar: publicProcedure
  .input(updateAvatarMemberSchema)
  .mutation(async ({ ctx, input }) => {
    return ctx.db.member.update({
      where: { id: input.id },
      data: {
        avatarURL: input.avatarURL,
      }
    });
  }),

  delete: publicProcedure
  .input(idSchema)
  .mutation(async ({ input, ctx }) => {
    return await ctx.db.member.delete({
      where: { id: input.id },
    })
  }),


});
