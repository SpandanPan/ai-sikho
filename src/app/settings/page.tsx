import ThemeToggle from "@/components/ThemeToggle";
import MotionToggle from "@/components/MotionToggle";
import AccountPanel from "@/components/AccountPanel";
import DeviceManager from "@/components/DeviceManager";

function Section({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="border border-paper-line rounded p-5">
      <h2 className="font-semibold text-sm mb-1">{title}</h2>
      <p className="text-sm text-ink-soft mb-4 max-w-md">{note}</p>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-accent2 mb-2">Settings</p>
      <h1 className="font-display text-2xl font-semibold mb-8">Your preferences</h1>

      <div className="flex flex-col gap-4">
        <Section title="Appearance" note="Light, dark, or match your system setting.">
          <ThemeToggle />
        </Section>

        <Section title="Motion" note="The AI Pulse feed on the homepage scrolls on its own by default.">
          <MotionToggle />
        </Section>

        <Section title="Account" note="Google sign-in, for saving quiz history and purchases.">
          <AccountPanel />
        </Section>

        <Section title="Devices" note="Manage which devices are signed in.">
          <DeviceManager />
        </Section>
      </div>
    </main>
  );
}
