import { PrismaAdapter } from "@next-auth/prisma-adapter";
import crypto from "node:crypto";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { hashOtp, hasAttemptsRemaining, isEmail, isOtpExpired, normalizeIdentifier } from "./otp";
import { canRegisterNewDevice, MAX_DEVICES } from "./deviceLimit";

// NextAuth stores sessions as signed JWTs (not DB-backed lookups on every
// request) — required anyway, since NextAuth does not support database
// sessions alongside a Credentials provider (our OTP flow). The trade-off:
// enforcing "max 2 devices" can't lean on NextAuth's own Session table
// (unused under JWT strategy), so DeviceSession (prisma/schema.prisma) is
// managed by hand across the signIn and jwt callbacks below.
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
    //
    // There's no separate "sign up" — entering the same email/phone again
    // always resolves to the same account (enforced by the @unique
    // constraint + upsert below), so a duplicate account is structurally
    // impossible. isNewUser tells the sign-in page whether to say "Account
    // created" or "Welcome back."
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

        const where = isEmail(identifier) ? { email: identifier } : { phone: identifier };
        const existing = await prisma.user.findUnique({ where });
        const user = existing
          ? existing
          : await prisma.user.create({
              data: isEmail(identifier)
                ? { email: identifier, emailVerified: new Date() }
                : { phone: identifier },
            });

        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.email ?? user.phone ?? undefined,
          isNewUser: !existing,
        };
      },
    }),
  ],
  callbacks: {
    // Runs for every provider (OTP and Google alike) before a session is
    // ever created — the single place the 2-device cap is enforced.
    // Returning false surfaces to the client as signIn()'s `error:
    // "AccessDenied"`, which the sign-in page shows as a specific
    // "already signed in on 2 devices" message (see SignInForm.tsx). If you
    // ever add another reason to return false from this callback, update
    // that client-side message too — it currently assumes AccessDenied
    // only ever means the device cap.
    async signIn({ user }) {
      if (!user.id) return true;
      const activeCount = await prisma.deviceSession.count({ where: { userId: user.id } });
      if (!canRegisterNewDevice(activeCount, MAX_DEVICES)) return false;
      await prisma.deviceSession.create({ data: { userId: user.id, deviceId: crypto.randomUUID() } });
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (trigger === "update" && token.sub) {
        // Client called useSession().update() after PATCH /api/account
        // changed the name — re-read it so the JWT (and therefore every
        // page's session.user.name) reflects it. This is the one
        // deliberate exception to "never hit the DB on token refresh": it
        // only runs on an explicit update, not on ordinary requests.
        const fresh = await prisma.user.findUnique({ where: { id: token.sub }, select: { name: true } });
        if (fresh) token.name = fresh.name;
        return token;
      }
      if (user) {
        // signIn already created this device's row (or blocked the sign-in
        // entirely, in which case NextAuth never reaches here) — attach its
        // id to the token.
        const device = await prisma.deviceSession.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
        });
        token.sub = user.id;
        token.deviceId = device?.deviceId;
        token.isNewUser = (user as { isNewUser?: boolean }).isNewUser ?? false;
      } else if (token.deviceId) {
        // Existing session being refreshed — confirm this device wasn't
        // explicitly signed out (via Settings) or otherwise removed since
        // the last check.
        const stillActive = await prisma.deviceSession.findUnique({
          where: { deviceId: token.deviceId },
        });
        if (!stillActive) {
          token.sub = undefined;
          token.deviceId = undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (!token.sub) {
        // Device was signed out (cap enforcement, or self-service in
        // Settings) — report an expired session so the client treats this
        // as logged out rather than showing stale "signed in" state.
        return { ...session, user: undefined, expires: new Date(0).toISOString() };
      }
      if (session.user) {
        session.user.id = token.sub;
        session.user.isNewUser = token.isNewUser ?? false;
        session.user.deviceId = token.deviceId;
      }
      return session;
    },
  },
};
