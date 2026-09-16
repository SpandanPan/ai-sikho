import type { Metadata } from "next";
import Script from "next/script";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import AnalyticsBeacon from "@/components/AnalyticsBeacon";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Sikho — Learn AI, Prep for GenAI Interviews",
  description: "AI news, model costs, AI fluency for beginners, and an interview-prep pack for GenAI engineers, starting at ₹100.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">
        {/* Runs before hydration so a saved theme preference applies with
            zero flash of the wrong theme — see ThemeToggle / /settings. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
            var t = localStorage.getItem('theme');
            if (t === 'dark' || t === 'light') document.documentElement.classList.add(t);
          } catch (e) {}`}
        </Script>
        <Providers>
          <AnalyticsBeacon />
          <Nav />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
