// Full content for "What Is Generative AI?" — step 03 of the homepage's
// "Learn AI from zero" path (LearnAiPath.tsx). Same typed-block pattern
// as the other articles.
//
// The hero image couldn't be previewed before placement — same
// session-wide image-viewing limit as prompting-101's and what-is-ai's
// hero images. Alt text is deliberately generic for the same reason.
//
// The "what should you learn next" list from the source draft isn't
// repeated here as its own content block — that's exactly what this
// article's relatedSlugs (see articles.ts) already renders as "Related
// reading," so writing it twice would just be the same list in two
// places drifting out of sync.

import type { ArticleBlock } from "./aiVsMlVsDl";
import { assetUrl } from "@/lib/assetUrl";

export const heroImage = {
  src: assetUrl("/articles/what-is-generative-ai/hero.png"),
  alt: "Illustration for What Is Generative AI? — a visual contrasting AI that recognizes things with AI that creates them.",
  width: 1024,
  height: 1536,
};

export const blocks: ArticleBlock[] = [
  { type: "p", text: "You've probably already used Generative AI. Maybe you've asked ChatGPT to write an email, used a tool to create an image from a sentence, or asked AI to summarize a document, write some code, or translate something. But there's a question hiding underneath all of this: what does \"Generative AI\" actually mean?" },
  { type: "callout", text: "Generative AI is AI that can create new content — text, images, audio, video, or code — based on patterns it has learned from existing data." },
  { type: "p", text: "The name sounds complicated. The basic idea isn't. Let's unpack what that actually means." },

  { type: "h2", text: "First: what makes it \"generative\"?" },
  { type: "p", text: "Imagine two AI systems. You show the first a photograph of a dog. It tells you: \"This is a dog.\" That's AI doing recognition. Now you tell another system: \"Create an image of a dog sitting on a bicycle in Kolkata.\" And it produces an image. That's generation." },
  { type: "p", text: "One system is identifying something about information that already exists. The other is creating a new output based on what you asked for. That's where the word \"generative\" comes from." },

  { type: "h2", text: "Generative AI can create much more than text" },
  { type: "p", text: "When people hear \"Generative AI,\" they often immediately think of ChatGPT. But text is only one part of the picture:" },
  { type: "list", items: [
    "Text — emails, articles, stories, summaries, reports, conversations, translations",
    "Images — illustrations, photorealistic scenes, product concepts, posters, logos, art",
    "Audio — music, voice, sound effects, voiceovers",
    "Video — short clips, animations, visual effects, marketing content",
    "Code — Python, JavaScript, SQL, HTML/CSS, scripts, software components",
  ] },
  { type: "p", text: "The underlying technology differs depending on what's being generated, but the broad idea is the same: give the system an input or instruction, and it generates an output." },

  { type: "h2", text: "But where does the AI learn all this?" },
  { type: "p", text: "Suppose you wanted to build an AI that could write reasonably good English. You wouldn't teach it every possible sentence one by one — there are far too many. Instead, you expose a model to a huge amount of text and let it learn patterns. It encounters \"The sun rises in the...\" and learns that \"east\" is a likely continuation. It encounters \"Thank you for your...\" and learns that \"time,\" \"help,\" or \"email\" might follow depending on context." },
  { type: "p", text: "It sees millions or billions of examples and gradually develops an internal mathematical representation of patterns in language. The same general idea applies to images (shapes, colors, objects, textures, visual relationships) and audio (speech, sounds, rhythm, pitch). The model isn't memorizing a catalogue of everything it's seen — it's learning statistical patterns and relationships in the data." },

  { type: "h2", text: "Here's the simplest mental model" },
  { type: "p", text: "Think about someone who's spent years reading books — different writing styles, sentence structures, vocabulary, ways of explaining ideas. Now you ask them: \"Write a short story about a detective in Mumbai.\" They don't open a database containing the exact story. They use what they've learned about language and storytelling to construct something new. Generative AI works on a much more mathematical version of this idea." },

  { type: "h2", text: "So does AI \"copy and paste\" what it learned?" },
  { type: "p", text: "Not in the simple way people sometimes imagine. A modern generative model doesn't generally work like \"search training data → find sentence → copy → paste into answer.\" Instead, during training, the model adjusts enormous numbers of internal parameters so it becomes better at capturing patterns in the training data. When you give it a prompt, those learned patterns help determine what output to generate." },
  { type: "callout", text: "That doesn't mean generated content is automatically original, accurate, or free from copyright concerns. Those are separate questions that depend on the model, its training data, the output, and how the content is used." },

  { type: "h2", text: "What actually happens when you ask ChatGPT a question?" },
  { type: "p", text: "You type: \"Explain climate change to a 10-year-old.\" A simplified version of what happens:" },
  { type: "diagram", text: "1. Your words are processed\n   (converted into a form the model can work with)\n\n2. The model considers the context\n   \"Explain\" ≠ \"write a poem\"\n   \"10-year-old\" → keep it simple\n   \"climate change\" → the subject\n\n3. The model predicts what should come next\n   generated piece by piece\n\n4. The response appears" },
  { type: "p", text: "It may look like the AI simply \"knew\" the answer. Underneath, a huge amount of mathematical computation happened very quickly." },

  { type: "h2", text: "Wait — is it just predicting the next word?" },
  { type: "p", text: "For language models, next-token prediction is fundamental to how generation works. But \"predicting the next word\" is a little misleading — models don't necessarily operate on whole words. They process tokens: words, pieces of words, punctuation, or other chunks." },
  { type: "p", text: "And predicting the next token well requires capturing surprisingly complex context. \"The doctor put the patient on the operating...\" has a very different likely continuation than \"The software engineer pushed the code to the...\" The model has learned patterns that help it distinguish between these contexts. Next-token prediction sounds simple; doing it well at enormous scale requires a sophisticated model." },

  { type: "h2", text: "A useful analogy: autocomplete on steroids" },
  { type: "p", text: "Your phone's autocomplete suggests \"tomorrow\" after you type \"See you.\" Generative AI does something conceptually related, but at a vastly greater scale and with much richer context — generating paragraphs, conversations, programs, summaries, and structured data, conditioned on a large amount of surrounding context. That's one reason it feels so different from traditional autocomplete." },

  { type: "h2", text: "What about images?" },
  { type: "p", text: "Text and image generation work differently under the hood, but the basic idea holds: learn patterns → receive an instruction → generate an output. Write \"A Bengal tiger walking through a misty forest at sunrise, cinematic photography,\" and an image model — having learned patterns associated with tigers, forests, sunrise, mist, photography, composition, and lighting — constructs an image matching your request. The result wasn't sitting somewhere waiting to be retrieved. The model generates it." },

  { type: "h2", text: "This is why the same prompt can produce different results" },
  { type: "p", text: "Ask an image generator for \"a house beside a lake at sunset\" and you might get a wooden cabin. Ask again — a modern glass house. Ask again — something closer to a fantasy castle. The prompt stayed roughly the same; the generated output changed. Generative systems can operate with an element of variation during generation, which is also why AI-generated content isn't always perfectly predictable." },

  { type: "h2", text: "Generative AI vs. traditional AI" },
  { type: "p", text: "Traditional AI systems are often designed to perform one particular prediction or decision — \"Is this transaction suspicious?\" → \"High risk\" or \"Low risk.\" A generative system might instead produce: \"Here is a summary of the transaction and the reasons it may warrant review...\"" },
  { type: "p", text: "The boundary isn't absolute — modern systems combine prediction, classification, retrieval, reasoning, and generation — but the distinction is useful. Traditional AI often asks \"What is this?\" or \"What will happen?\" Generative AI often asks \"What can I create from this?\"" },

  { type: "h2", text: "Generative AI vs. AI" },
  { type: "p", text: "Here's where the terminology gets confusing. AI is the big umbrella. Generative AI is one part of that larger field:" },
  { type: "diagram", text: "                    ARTIFICIAL INTELLIGENCE\n                           │\n            ┌──────────────┴──────────────┐\n            │                             │\n      Predict / classify             Generate\n            │                             │\n       Traditional AI              Generative AI\n                                          │\n                     ┌────────────────────┼─────────────────┐\n                     │                    │                 │\n                   Text                Images             Audio\n                     │                    │                 │\n                   Code                 Video          Music / Voice" },
  { type: "p", text: "This isn't a strict technical taxonomy — AI systems overlap in many ways — but it's a useful mental model." },

  { type: "h2", text: "And where does Machine Learning fit?" },
  { type: "diagram", text: "Artificial Intelligence\n        ↓\nMachine Learning\n        ↓\nDeep Learning\n        ↓\nMany modern Generative AI systems" },
  { type: "p", text: "AI is the broad field. Machine Learning is a major way of building AI systems by learning patterns from data. Deep Learning uses neural networks with many layers to learn complex patterns. And many modern generative systems are built using deep learning. The full breakdown of how these nest is its own article — see \"Related reading\" below." },

  { type: "h2", text: "What are LLMs?" },
  { type: "p", text: "LLM stands for Large Language Model. It's a type of AI model designed to work with language — the models behind ChatGPT and similar tools are examples of this category. An LLM takes language as input and generates language as output, which is why you can ask it to explain, rewrite, summarize, translate, brainstorm, or write code. A single model can perform many different tasks without being separately programmed for each one." },

  { type: "h2", text: "Why did Generative AI suddenly become such a big deal?" },
  { type: "p", text: "Generative AI isn't brand new — researchers have worked on generative models for years. What changed dramatically:" },
  { type: "list", items: [
    "More data — models could train on enormous datasets",
    "More computing power — modern hardware made training very large neural networks possible",
    "Better architectures — advances in neural-network design dramatically improved what models could learn",
    "Better training techniques — better ways to make models useful for interacting with people",
    "Better interfaces — you no longer need to understand machine learning to use these systems; you can just type \"Help me write this email.\"",
  ] },
  { type: "p", text: "That last part is especially important. AI became conversational." },

  { type: "h2", text: "And that changed who could use it" },
  { type: "p", text: "Before modern Generative AI tools, using sophisticated AI often required programming, data, APIs, specialized software, and machine-learning knowledge. Now someone can open a browser and type \"Explain my electricity bill\" or \"Turn these meeting notes into an email\" or \"Give me five ideas for a birthday party.\" The barrier to entry has fallen dramatically — that's one reason Generative AI matters beyond technology companies." },

  { type: "h2", text: "What can you actually use it for?" },
  { type: "p", text: "At work: draft emails, summarize meetings, analyze documents, brainstorm ideas, create presentations, rewrite content, extract information, generate reports. The key question isn't \"Can AI do my entire job?\" — it's \"Which parts of my job involve repetitive thinking, writing, searching, summarizing, or transforming information?\" Those are often places where AI can help." },
  { type: "p", text: "For learning, it can act like a personal tutor — \"Explain quantum computing like I'm 15,\" then \"Now explain it like I'm a physics student,\" then \"Give me three questions to test whether I understood it.\" You adapt the conversation to your level, very different from a fixed textbook chapter." },
  { type: "p", text: "For creativity, it shortens the distance from idea to first draft — idea → outline → article → illustration → presentation, or idea → product concept → landing page → prototype. It isn't necessarily replacing the person; often it's reducing the distance between having an idea and doing something with it." },
  { type: "p", text: "For software development, it can explain unfamiliar code, generate boilerplate, write tests, debug errors, convert code between languages, create documentation, and prototype ideas. But the rule holds everywhere: generated code still needs to be understood and tested. AI can accelerate the work — it doesn't automatically make the result correct." },

  { type: "h2", text: "Here's where things get uncomfortable" },
  { type: "p", text: "Generative AI is incredibly useful. It can also be confidently wrong. You might ask \"Who was the first person to...\" and get an answer that sounds perfectly reasonable — but is wrong. This is commonly called an AI hallucination. The model isn't necessarily \"lying\" — it's generating output that fits patterns it learned, even though the resulting claim isn't supported by reality." },
  { type: "callout", text: "Fluent ≠ factual. Confident ≠ correct. This is one of the most important rules for using Generative AI responsibly." },

  { type: "h2", text: "Generative AI doesn't \"understand\" exactly like you do" },
  { type: "p", text: "You'll often hear \"AI understands this\" — worth being careful with that statement. Generative AI systems can represent and manipulate surprisingly complex patterns, explain concepts, reason through some problems, follow instructions, and use information in sophisticated ways. But that doesn't mean they understand the world exactly the way a human does. The safest mental model: powerful pattern-learning and generation machines, not miniature humans living inside your computer." },

  { type: "h2", text: "Generating isn't the same as knowing" },
  { type: "p", text: "Ask \"What's the population of a particular city?\" and the model may generate a number — but that doesn't necessarily mean it looked up the latest official statistic. This is why modern AI systems increasingly combine models with other tools: search, databases, calculators, APIs, company documents, code execution. The model generates; the tools provide current or authoritative information. Together, they create much more reliable systems — that's what RAG and AI Agents (both covered elsewhere) are actually for." },

  { type: "h2", text: "So is Generative AI actually creative?" },
  { type: "p", text: "That's a harder question. Generative AI can produce outputs that are novel, unexpected, visually interesting, stylistically varied, and useful — but it generates them from patterns learned from existing data. Whether that counts as creativity in the same sense as human creativity is a philosophical question the technology itself doesn't settle. Practically speaking, though: Generative AI can dramatically expand what a person can create. Someone who can't draw can create an illustration. Someone who isn't a programmer can prototype software. Someone who struggles with writing can produce a first draft. That changes the economics of creation." },

  { type: "h2", text: "The biggest opportunity may not be AI creating instead of humans" },
  { type: "p", text: "It may be humans creating with AI: a photographer removing tedious background work, a teacher writing personalized explanations, a doctor summarizing information for review, a designer exploring 50 concepts before choosing one, a programmer turning an idea into a prototype in an afternoon. The interesting question isn't always \"Will AI replace this person?\" Sometimes it's \"What could this person do if the tedious parts became much easier?\"" },

  { type: "h2", text: "But there are real challenges" },
  { type: "list", items: [
    "Accuracy — can we trust what it produces?",
    "Copyright — what happens when models are trained on enormous collections of human-created work?",
    "Privacy — what happens to sensitive information entered into AI systems?",
    "Bias — can models reproduce biases present in their training data?",
    "Jobs — which tasks become automated, and which new tasks appear?",
    "Misuse — what happens when the same technology creates misinformation, scams, or other harmful content?",
  ] },
  { type: "p", text: "There aren't simple answers to all of these. Understanding the technology isn't just about learning how to use it — it's also about understanding where not to trust it blindly." },

  { type: "h2", text: "The easiest way to remember Generative AI" },
  { type: "callout", text: "Traditional software: you tell the computer exactly what to do. Generative AI: you describe what you want, and the system generates a possible result." },
  { type: "p", text: "That's a major shift in how we interact with computers. Instead of learning every button and menu, we increasingly communicate through language, examples, and intent." },

  { type: "h2", text: "And that's why prompting matters" },
  { type: "p", text: "Once AI can generate things from instructions, a new skill becomes important: knowing how to ask. Compare \"Write something about marketing\" with \"I'm launching a small bakery in Bangalore. Write a short Instagram post announcing our opening. Keep it friendly, local, and under 100 words.\" The second gives the AI a goal, context, audience, location, format, and constraints — and the result is likely to be much more useful. Prompting isn't about discovering magic words. It's about learning to communicate your intent clearly — see \"Related reading\" below for the full guide." },

  { type: "h2", text: "So, what is Generative AI?" },
  { type: "callout", text: "Generative AI is a class of AI systems that learns patterns from large amounts of data and uses those patterns to generate new content in response to an input or instruction." },
  { type: "p", text: "It can generate text, images, audio, video, and code. It can help people learn, create, analyze, communicate, and build. And it's changing how we interact with computers." },
  { type: "p", text: "But there's one idea worth keeping in your head: Generative AI doesn't magically \"know\" things. It generates outputs based on patterns it has learned and the information available to it. That makes it incredibly powerful — and imperfect. Understanding both sides is what makes you a better AI user." },

  { type: "h2", text: "One final mental model" },
  { type: "diagram", text: "                GENERATIVE AI\n\n             Learns from examples\n                      ↓\n             Learns patterns\n                      ↓\n               You give a prompt\n                      ↓\n             Model processes it\n                      ↓\n             Generates an output\n                      ↓\n       ┌────────┬────────┬────────┐\n       ↓        ↓        ↓        ↓\n      Text    Images   Audio     Code\n                         ↓\n                       Video" },
  { type: "p", text: "The remarkable part isn't that a machine can generate text or images. The remarkable part is that we can now interact with powerful computational systems using something as natural as language. And we're still figuring out what that makes possible." },
];
