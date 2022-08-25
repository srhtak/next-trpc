import { createRouter } from "../context";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { resolve } from "path";

interface JwtPayload {
  id: string;
}

export const postRouter = createRouter()
.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next();
})
  .mutation("createPost", {
    input: z.object({
      title: z.string(),
      content: z.string().nullish(),
    }),
    async resolve({ input, ctx }) {
      const token = ctx.req?.cookies?.token;
      if (!token) throw new Error("Invalid user token");
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
  })
  .query("getPostByAuthor", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: +input.id,
        },
      });
      return posts;
    },
  }).query('getPostById',{
    input:z.object({
      id:z.string()
    }),
    async resolve({input,ctx}){
      const post = await ctx.prisma.post.findUnique({
        where:{
          id: +input.id,
        },
      })
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${input.id}'`,
        });
      }
      return post;
    }
  }).query('allPosts',{
    async resolve({ctx}){
      if(!ctx.req?.cookies) throw new Error('Invalid user creadential')
      const posts = await ctx.prisma.post.findMany({})
      return posts;
    }
  })
