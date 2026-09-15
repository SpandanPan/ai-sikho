"use client";

// No PDF library wired up (a real one, e.g. for emailing a PDF receipt
// attachment, is a natural upgrade later, not built now) — the browser's
// own "Print > Save as PDF" is a genuinely fine zero-dependency way to get
// a PDF from a clean, print-styled HTML page in the meantime.
export default function PrintInvoiceButton() {
  return (
    <button
      onClick={() => window.print()}
      className="font-mono text-xs bg-ink text-paper rounded px-3.5 py-2 print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
