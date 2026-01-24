import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import LoginLog from "@/models/LoginLog";
// changed session data

export const authOptions = {
  // ------------------- New Added Code -------------------
   trustHost: true,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        await dbConnect();

        // ✅ Allow both super_admin and staff users
        const user = await User.findOne({
          email: new RegExp(`^${credentials.email.trim()}$`, "i"),
          $or: [{ isAdmin: true }, { role: { $in: ["super_admin", "staff"] } }],
        });
        console.log("Auth User:", user);
        if (!user) throw new Error("Invalid email or password");

        const isMatch = await bcrypt.compare(credentials.password, user.hash);
        if (!isMatch)
          if (!isMatch) throw new Error("Invalid email or password");
          
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.profileImage?.url || null,
          isAdmin: user.isAdmin || user.role === "super_admin",
          role: user.role || (user.isAdmin ? "super_admin" : "user"),
          permissions: user.permissions || null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        // sameSite: "lax",
        // ------------------- New Added Code -------------------
        sameSite: "none",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id;
  //       token.phone = user.phone;
  //       // token.image = user.image;
  //       token.isAdmin = user.isAdmin;
  //       token.role = user.role;
  //       token.permissions = user.permissions;
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token) {
  //       session.user = {
  //         ...session.user,
  //         id: token.id,
  //         phone: token.phone,
  //         // image: token.image,
  //         isAdmin: token.isAdmin,
  //         role: token.role,
  //         permissions: token.permissions,
  //       };
  //     }
  //     return session;
  //   },
  // },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.isAdmin = token.isAdmin;
      return session;
    },
  },

  events: {
    async signIn({ user, account, req }) {
      try {
        await dbConnect();
        const ip =
          req?.headers["x-forwarded-for"]?.split(",")[0] ||
          req?.headers["x-real-ip"] ||
          req?.socket?.remoteAddress ||
          "Unknown";

        await LoginLog.create({
          userId: user.id,
          email: user.email,
          ip,
          date: new Date(),
          provider: account?.provider || "credentials",
        });
      } catch (err) {
        console.error("Failed to save login log:", err);
      }
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
