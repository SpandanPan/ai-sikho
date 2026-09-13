"use client";

import { trackClick } from "@/lib/trackEvent";

// Thin wrapper so server-component pages (the homepage) can still fire a
// CLICK analytics event on a specific CTA without becoming client
// components themselves.
export default function TrackedLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={() => trackClick(label)}>
      {children}
    </a>
  );
}
