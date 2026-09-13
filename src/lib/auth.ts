import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

// NextAuth stores sessions as signed JWTs by default (not DB-backed lookups
// on every request), and the Prisma adapter only persists the account/user
// record itself. That's what keeps login cheap under concurrent traffic —
// there is no per-request database round trip to check "is this user
// logged in," and Vercel's serverless functions scale horizontally per
// request rather than queuing behind one long-lived server process.
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};
