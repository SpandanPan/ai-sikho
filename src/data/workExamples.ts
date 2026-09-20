// Illustrative example scenarios for the Work With Us section — made up
// to be concrete and India-specific (not real client work, no real
// business names), so a visitor can picture what "AI Readiness" actually
// looks like instead of reading only abstract service descriptions.
// Each one is deliberately labeled illustrative in the UI that renders
// this, not presented as a testimonial or case study.
export type WorkExample = { icon: string; category: string; problem: string; fix: string };

export const workExamples: WorkExample[] = [
  {
    icon: "🧾",
    category: "Accounting",
    problem: "A small trading firm's accountant spent 6+ hours every month manually matching GSTR-2A entries against purchase invoices, line by line.",
    fix: "An AI workflow now cross-checks the two automatically and flags only the mismatches — the accountant reviews exceptions instead of every row.",
  },
  {
    icon: "🧑‍💼",
    category: "HR",
    problem: "An HR manager at a 40-person startup fielded the same WhatsApp questions all day — \"how many leaves do I have left,\" \"what's the WFH policy.\"",
    fix: "A chatbot trained on the employee handbook now answers instantly, any time of day, and only escalates the genuinely unusual questions.",
  },
  {
    icon: "📦",
    category: "Operations",
    problem: "A D2C seller was manually typing WhatsApp order confirmations and invoices one by one as orders came in through the day.",
    fix: "An automated workflow now generates and sends both the moment an order lands — no manual step in between.",
  },
  {
    icon: "🧮",
    category: "Accounting",
    problem: "A logistics company spent about 2 days a month sorting hundreds of UPI and card transaction receipts into expense categories for their CA.",
    fix: "AI now auto-categorizes the large majority of them from the receipt text alone, leaving only genuinely ambiguous ones for a human to sort.",
  },
  {
    icon: "🌐",
    category: "Customer Support",
    problem: "A regional seller got customer questions in Tamil, Hindi, and English, and didn't have budget for three separate language-specific support hires.",
    fix: "One AI-assisted support setup now handles all three languages in the same inbox, with a human only stepping in for anything that needs judgment.",
  },
  {
    icon: "📄",
    category: "Operations",
    problem: "A small agency's team re-typed the same client onboarding details into four different tools every time a new client signed.",
    fix: "One form now feeds all four systems automatically — the same information typed once instead of four times.",
  },
];
