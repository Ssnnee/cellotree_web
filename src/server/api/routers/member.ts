import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const memberSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  birthdate: z.date(),
  sex: z.enum(["male", "female"]),
  placeOfBirth: z.string(),
  avatarURL: z.string().optional(),
  description: z.string(),
  treeId: z.string(),
})

const updateMemberSchema = memberSchema.extend({ id: z.string() })
const idSchema = z.object({ id: z.string() });
const updateAvatarMemberSchema = idSchema.extend({ avatarURL: z.string()})

export const memberRouter = createTRPCRouter({
  getById: publicProcedure
    .input(idSchema)
    .query(({ ctx, input }) => {
      return ctx.db.member.findFirst({
        where: { id: input.id },
        include: { relation: true },
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
            where: { sex: "male" },
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
            where: { sex: "female" },
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
      await ctx.db.relation.deleteMany({
        where: { memberId: input.id },
      })

      await ctx.db.member.delete({
        where: { id: input.id },
      })

      return { success: true, message: "Member and associated data deleted successfully" };
    }),


});
