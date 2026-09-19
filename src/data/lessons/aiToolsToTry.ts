// Lesson content for "AI Tools You Can Start Using Today" — this used to
// be a "Run It Free" section on the homepage; moved here because it's
// genuinely a lesson (steps + a real example per tool), not a homepage
// widget, and it belongs next to the rest of the AI Fluency track it's
// written for.
import type { LessonSection, Lesson } from "./aiFluencyBasics";

const sections: LessonSection[] = [
  {
    heading: "Ollama — local & private",
    url: "https://ollama.com/download",
    body: [
      "Runs open models (Llama, Mistral, Gemma, Qwen, DeepSeek) entirely on your own machine — no account, no bill, and nothing you type ever leaves your laptop.",
      "Getting started: download and install it for your OS. Open a terminal and run a command like ollama run llama3. Type your question straight into the terminal — it replies right there.",
      "Use it for: drafting an internal HR policy, or anything with sensitive details, without sending it to any company's servers.",
    ],
  },
  {
    heading: "Hugging Face — exploring models",
    url: "https://huggingface.co",
    body: [
      "A hub with thousands of downloadable open models and live demo \"Spaces\" you can try without installing anything.",
      "Getting started: create an account. Open the \"Spaces\" tab and search for a demo — try an image generator or a chatbot. Use it right in your browser.",
      "Use it for: trying three different open image-generator models side by side before deciding whether a paid tool is actually worth it for you.",
    ],
  },
  {
    heading: "LM Studio — no command line",
    url: "https://lmstudio.ai",
    body: [
      "The same private, offline idea as Ollama, but with a normal app window instead of a terminal — everything happens by clicking, not typing commands.",
      "Getting started: download and install the app. Browse and download a small model from inside the app itself. Chat with it in the built-in window.",
      "Use it for: private, offline chatting if a terminal genuinely isn't your thing.",
    ],
  },
  {
    heading: "Google AI Studio — fast prototyping",
    url: "https://aistudio.google.com",
    body: [
      "A generous daily quota on Google's Gemini Flash models, usable straight from your browser.",
      "Getting started: sign in with any Google account. Start a new prompt and pick a Gemini Flash model. Test prompts directly in the browser — no setup, no install.",
      "Use it for: writing the same request five different ways and comparing the five answers side by side, before deciding which phrasing actually works for a task at your job.",
    ],
  },
  {
    heading: "Groq — speed",
    url: "https://console.groq.com",
    body: [
      "An API tier serving open models at unusually high inference speed — the whole reason people reach for it.",
      "Getting started: sign up and generate an API key. Try the in-browser Playground first — no code needed. If you're technical, drop the key into a script to feel the speed yourself.",
      "Use it for: asking something in the Playground and watching the entire answer appear almost instantly.",
    ],
  },
];

export const lesson: Lesson = {
  slug: "ai-tools-to-try",
  estMinutes: 10,
  sections,
};
