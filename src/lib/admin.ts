// Deliberately env-based rather than a database role: for a solo-owner
// site, "only I can onboard mentors" is simpler and harder to accidentally
// misconfigure as a comma-separated allowlist than as a togglable DB flag
// someone could flip via a bug elsewhere. Add a real Role enum on User if
// this ever needs to support a second admin who isn't you.
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}
