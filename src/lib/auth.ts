import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { hashOtp, hasAttemptsRemaining, isEmail, isOtpExpired, normalizeIdentifier } from "./otp";

// NextAuth stores sessions as signed JWTs by default (not DB-backed lookups
// on every request), and the Prisma adapter only persists the account/user
// record itself. That's what keeps login cheap under concurrent traffic —
// there is no per-request database round trip to check "is this user
// logged in," and Vercel's serverless functions scale horizontally per
// request rather than queuing behind one long-lived server process.
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    // Primary sign-in path: email or phone + a 6-digit OTP (see
    // src/app/api/auth/otp/*). Chosen over Google-only so we capture a real,
    // verified contact channel for every user, not just whoever has Google.
    CredentialsProvider({
      id: "otp",
      name: "Email or phone",
      credentials: {
        identifier: { label: "Email or phone", type: "text" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.code) return null;
        const identifier = normalizeIdentifier(credentials.identifier);

        const record = await prisma.otpCode.findFirst({
          where: { identifier, consumed: false },
          orderBy: { createdAt: "desc" },
        });
        if (!record) return null;
        if (isOtpExpired(record.expiresAt)) return null;
        if (!hasAttemptsRemaining(record.attempts)) return null;

        if (record.codeHash !== hashOtp(credentials.code)) {
          await prisma.otpCode.update({
            where: { id: record.id },
            data: { attempts: { increment: 1 } },
          });
          return null;
        }

        await prisma.otpCode.update({ where: { id: record.id }, data: { consumed: true } });

        const user = isEmail(identifier)
          ? await prisma.user.upsert({
              where: { email: identifier },
              update: {},
              create: { email: identifier, emailVerified: new Date() },
            })
          : await prisma.user.upsert({
              where: { phone: identifier },
              update: {},
              create: { phone: identifier },
            });

        return { id: user.id, email: user.email ?? undefined, name: user.email ?? user.phone ?? undefined };
      },
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
