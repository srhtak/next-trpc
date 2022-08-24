import { createRouter } from "../context";
import { z } from "zod";
import bcrypt from "bcrypt";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const authSchema = z.object({
  email: z.string(),
  password: z.string(),
});

interface JwtPayload {
  id: string;
}

export const authRouter = createRouter()
  .mutation("signin", {
    input: authSchema,
    async resolve({ input, ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      try {
        if (user && bcrypt.compareSync(input.password, user.password)) {
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              time: Date.now(),
            },
            `${process.env.JWT_SECRET}`,
            { expiresIn: "3h" }
          );

          ctx.res?.setHeader(
            "Set-Cookie",
            cookie.serialize("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              maxAge: 1000 * 60 * 60 * 3,
            })
          );
          return {
            message: "Successfully signed in",
            user,
          };
        }
        return {
          message: "Invalid user credentials"
        }
        
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          return {
            message: "User not found",
          };
        }
        throw error;
      }
    },
  })
  .mutation("signup", {
    input: z
      .object({
        name: z.string().min(3).max(20),
      })
      .merge(authSchema),
    async resolve({ input, ctx }) {
      try {
        const user = await ctx.prisma.user.create({
          data: {
            ...input,
            password: bcrypt.hashSync(input.password, 10),
          },
        });
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            time: Date.now(),
          },
          `${process.env.JWT_SECRET}`,
          { expiresIn: "3h" }
        );

        ctx.res?.setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 3,
          })
        );
        return {
          user,
          message: "User created successfully",
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          return {
            message: "User already exists",
          };
        }
        throw error;
      }
    },
  })
  .query("user", {
    async resolve({ ctx }) {
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
          return {
            user,
          };
        } catch (error) {
          return null;
        }
      }
    },
  })
  .query("allUser", {
    async resolve({ ctx }) {
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          posts: {
            select: {
              id: true,
              title: true,
              content: true,
            },
          },
        },
      });
      return {
        users,
      };
    },
  });
