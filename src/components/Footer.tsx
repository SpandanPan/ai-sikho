export default function Footer() {
  return (
    <footer className="border-t border-paper-line mt-12">
      <div className="mx-auto max-w-5xl px-5 py-6 flex items-center justify-between gap-4 flex-wrap">
        <p className="font-mono text-[11px] text-ink-soft">© {new Date().getFullYear()} The Model Desk</p>
        <div className="flex gap-4">
          <a href="/privacy" className="font-mono text-[11px] text-ink-soft hover:text-accent-ink">Privacy</a>
          <a href="/terms" className="font-mono text-[11px] text-ink-soft hover:text-accent-ink">Terms</a>
          <a href="/refund-policy" className="font-mono text-[11px] text-ink-soft hover:text-accent-ink">Refunds</a>
        </div>
      </div>
    </footer>
  );
}
