// Full content for "What Is AI?" — step 01 of the homepage's "Learn AI
// from zero" path (LearnAiPath.tsx). The first stop, so deliberately
// shorter and warmer than the other pieces: curiosity over rigor.
//
// The hero image couldn't be previewed before placement — same
// session-wide image-viewing limit hit on the prompting-101 article's
// images (confirmed again here at just 474x500px). Alt text is
// deliberately generic for the same reason.

import type { ArticleBlock } from "./aiVsMlVsDl";

export const heroImage = {
  src: "/articles/what-is-ai/hero.png",
  alt: "Illustration for What Is AI? — a curiosity-driven, beginner-friendly visual, not a technical diagram.",
  width: 1222,
  height: 1287,
  caption: "AI isn't about replacing curiosity. It's about giving your curiosity more to work with.",
};

export const blocks: ArticleBlock[] = [
  { type: "p", text: "Artificial Intelligence is simply a way of making computers do things that usually need human intelligence — like understanding language, spotting patterns, solving problems, creating things, and making decisions. At its core, AI learns from examples and uses what it has learned to respond to new situations. You don't need to understand how the models work under the hood to start using AI. You just need to be curious about what it can help you do." },

  { type: "h2", text: "You already use AI." },
  { type: "list", items: [
    "Recommendations — the shows Netflix suggests, the products Amazon shows you first",
    "Google Maps — predicting how long your drive will actually take, not just the distance",
    "Spam filters — quietly deciding what never reaches your inbox",
    "Voice assistants — Siri, Alexa, Google Assistant understanding what you just said",
    "ChatGPT — answering a question or drafting something for you",
    "Image generators — turning a sentence into a picture that didn't exist a second ago",
  ] },
  { type: "p", text: "None of these felt like \"AI\" the first time you used them. They just felt like the app working well. That's the part worth noticing — AI has mostly been arriving quietly, as a feature inside something else, long before it showed up as a chatbot you could talk to directly." },

  { type: "h2", text: "So what actually makes something \"AI\"?" },
  { type: "p", text: "Here's the common thread across every example above: none of them were given an exact rulebook for every situation. Nobody wrote down \"if the driveway is icy and it's a Tuesday, add four minutes.\" Instead, each system looked at a huge number of examples — millions of past trips, millions of emails, millions of photos — and learned the patterns in them well enough to make a good guess about something new." },
  { type: "p", text: "That's really it. Learn from examples, apply the pattern to a new situation. Everything else you'll hear — machine learning, deep learning, large language models — is a more specific answer to \"okay, but how does it actually learn the pattern?\" You don't need those answers yet to use AI well. You need them only once you're curious about what's happening underneath — which is exactly where this path goes next." },

  { type: "callout", text: "You don't have to understand how a car engine works to be a good driver. Same idea here." },
];
