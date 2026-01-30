import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import LoginLog from "@/models/LoginLog";

export default NextAuth({
  trustHost: true,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        userType: {},
      },

      async authorize(credentials) {
        await dbConnect();

        const username = credentials.email?.trim();
        const password = credentials.password;

        if (!username || !password) {
          throw new Error("Missing credentials");
        }

        const query = username.includes("@")
          ? { email: new RegExp(`^${username}$`, "i") }
          : { phone: username };

        const user = await User.findOne({
          ...query,
          isActive: true,
          isDeleted: { $ne: true },
        });

        if (!user) {
          throw new Error("Invalid email/mobile or password");
        }

        const isMatch = await bcrypt.compare(password, user.hash);
        if (!isMatch) {
          throw new Error("Invalid email/mobile or password");
        }

        const userType = credentials.userType || "admin";

        if (userType === "admin" && !user.isAdmin) {
          throw new Error("Admin access only");
        }

        if (userType === "employee" && user.isAdmin) {
          throw new Error("Employee access only");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isAdmin: user.isAdmin,
          permissions: user.permissions,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
        token.permissions = user.permissions;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.isAdmin = token.isAdmin;
      session.user.permissions = token.permissions;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  events: {
    async signIn({ user, account, req }) {
      try {
        await dbConnect();

        const ip =
          req?.headers?.["x-forwarded-for"]?.split(",")[0] ||
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
        console.error("Login log error:", err);
      }
    },
  },
});

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";

// import dbConnect from "@/lib/mongoose";
// import User from "@/models/User";
// import LoginLog from "@/models/LoginLog";

// export default NextAuth({
//   trustHost: true,

//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60,
//   },

//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {},
//         password: {},
//       },
//       async authorize(credentials) {
//         await dbConnect();

//         const email = credentials.email?.trim();
//         const password = credentials.password;

//         if (!email || !password) {
//           throw new Error("Missing credentials");
//         }

//         const user = await User.findOne({
//           email: new RegExp(`^${email}$`, "i"),
//           isActive: true,
//           isDeleted: { $ne: true },
//         });

//         if (!user) {
//           throw new Error("Invalid email or password");
//         }

//         const isMatch = await bcrypt.compare(password, user.hash);
//         if (!isMatch) {
//           throw new Error("Invalid email or password");
//         }

//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           isAdmin: user.isAdmin,
//           permissions: user.permissions || [],
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//         token.isAdmin = user.isAdmin;
//         token.permissions = user.permissions;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       session.user.id = token.id;
//       session.user.role = token.role;
//       session.user.isAdmin = token.isAdmin;
//       session.user.permissions = token.permissions;
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },

//   secret: process.env.NEXTAUTH_SECRET,

//   events: {
//     async signIn({ user, account, req }) {
//       try {
//         await dbConnect();

//         const ip =
//           req.headers["x-forwarded-for"]?.split(",")[0] ||
//           req.socket?.remoteAddress ||
//           "Unknown";

//         await LoginLog.create({
//           userId: user.id,
//           email: user.email,
//           ip,
//           date: new Date(),
//           provider: account?.provider || "credentials",
//         });
//       } catch (err) {
//         console.error("Login log error:", err);
//       }
//     },
//   },
// });
