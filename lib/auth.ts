import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  providers: [
    GitHub,
    Google,
    Resend({
      from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    }),
  ],
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.isAdmin = user.isAdmin ?? false;
      return session;
    },
  },
});
