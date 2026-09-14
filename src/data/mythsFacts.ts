// Punchy one-liners derived from src/data/quizQuestions.ts — same facts,
// written for a homepage teaser strip instead of a quiz question. Not
// generated from that file programmatically (a quiz explanation doesn't
// read naturally as a myth/fact line), so if a quiz question's underlying
// fact ever changes, check here too.
export type MythFact = { myth: string; fact: string };

export const mythsFacts: MythFact[] = [
  { myth: "AI remembers you between chats.", fact: "Most don't — unless a product specifically adds that feature." },
  { myth: "If AI doesn't know something, it says so.", fact: "It can hallucinate a wrong answer with total confidence instead." },
  { myth: "All useful AI costs money.", fact: "Several capable models are free to run yourself, no bill at all." },
  { myth: "A chatbot and an AI agent are the same thing.", fact: "An agent takes multi-step actions on its own — a chatbot just replies." },
  { myth: "AI-written code is toy-level at best.", fact: "It can write real, working programs — though it still needs review." },
];
