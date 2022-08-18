import { createRouter } from "../context";
import jwt from "jsonwebtoken";
import { z } from "zod";

interface JwtPayload {
  id: string;
}

export const postRouter = createRouter().mutation("createPost", {
  input: z.object({
    title: z.string(),
    content: z.string().nullish(),
  }),
  async resolve({ input, ctx }) {
    const token = ctx.req?.cookies?.token;
    if (!token) return null;
    if (token) {
      let user;
      try {
        const { id } = jwt.verify(
          token,
          `${process.env.JWT_SECRET}`
        ) as JwtPayload;
        user = await ctx.prisma.user.findUnique({
          where: {
            id: +id,
          },
        });
        if (!user) throw new Error("User not found");
        const post = await ctx.prisma.post.create({
          data: {
            ...input,
            authorId: user.id,
          },
        });
        return {
          user,
          post,
        };
      } catch (error) {
        return null;
      }
    }
  },
});
