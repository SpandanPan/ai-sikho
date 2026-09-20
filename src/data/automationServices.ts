export type AutomationService = { slug: string; title: string; description: string; icon: string };

export const automationServices: AutomationService[] = [
  { slug: "support-chatbot", icon: "💬", title: "Customer Support Chatbot", description: "A RAG-powered bot trained on your docs and FAQs, answering customers instantly instead of a queue." },
  { slug: "internal-search", icon: "🔍", title: "Internal Knowledge Search", description: "RAG search across your internal documents, wikis, and policies — stop digging through folders." },
  { slug: "lead-triage", icon: "📥", title: "Lead Qualification & Email Triage", description: "An agent that sorts, prioritizes, and drafts responses to inbound leads before a human touches them." },
  { slug: "workflow-automation", icon: "⚙️", title: "Workflow Automation", description: "Stitch your existing tools together (n8n/Zapier + an LLM step) to remove one specific manual task." },
  { slug: "readiness-audit", icon: "📋", title: "AI Readiness Audit", description: "A short paid working session and a written report: 3–5 workflows in your business that are automatable today." },
  { slug: "other", icon: "🤔", title: "Not sure where AI fits?", description: "Tell me what your team does manually. We'll identify where AI could — and couldn't — help." },
];
