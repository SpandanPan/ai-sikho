// Full content for the "AI vs. Machine Learning vs. Deep Learning" article.
// Structured as typed blocks (not raw HTML/markdown) so the renderer in
// src/app/articles/[slug]/page.tsx can apply the site's own typography
// and theme tokens consistently — same approach as src/data/lessons/.

import { assetUrl } from "@/lib/assetUrl";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "diagram"; text: string }
  | { type: "callout"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string };

export const heroImage = { src: assetUrl("/articles/ai-vs-ml-vs-dl/hero.png"), alt: "AI vs. Machine Learning vs. Deep Learning, shown as one mountain seen from three altitudes — AI at the base, Machine Learning partway up, Deep Learning at the summit.", width: 1024, height: 1536 };

export const blocks: ArticleBlock[] = [
  { type: "p", text: "If you have spent any time reading about technology, you have probably encountered these three terms: Artificial Intelligence (AI), Machine Learning (ML), Deep Learning (DL)." },
  { type: "p", text: "They often appear as if they mean the same thing. A company launches an AI product, another says it uses machine learning, and another proudly announces that it is powered by deep learning." },
  { type: "callout", text: "So, are they different things? Yes — but they are also parts of the same bigger picture." },
  { type: "p", text: "The easiest way to remember the relationship: Artificial Intelligence is the broadest concept. Machine Learning is one way of building AI. Deep Learning is one particular approach within Machine Learning." },
  { type: "p", text: "Think of them as Russian dolls — AI → Machine Learning → Deep Learning." },

  { type: "h2", text: "1. First, what exactly is Artificial Intelligence?" },
  { type: "p", text: "Let's start with the biggest circle. Artificial Intelligence, or AI, is the broad idea of making machines perform tasks that we normally associate with human intelligence. That could include:" },
  { type: "list", items: ["Understanding language", "Recognizing images", "Solving problems", "Planning", "Making decisions", "Understanding speech", "Playing games", "Recommending things", "Reasoning about information", "Generating text, images, music or code"] },
  { type: "p", text: "Notice something important here: AI doesn't necessarily mean that a machine has to learn from data. A machine can behave \"intelligently\" using rules written by humans." },
  { type: "p", text: "Imagine a simple medical system. Suppose we build a program that says:" },
  { type: "diagram", text: "If temperature > 38°C\nAND cough = yes\nAND oxygen level < 95%\n→ Flag patient for further examination." },
  { type: "p", text: "There is no learning involved. A human created the rules. Yet the system is attempting to perform a task associated with human decision-making. That's still AI in the broad sense." },

  { type: "image", src: assetUrl("/articles/ai-vs-ml-vs-dl/comparison-table.jpeg"), alt: "Three-column comparison of Artificial Intelligence, Machine Learning, and Deep Learning, each with a definition, usage, and example algorithms.", caption: "The three terms side by side — definition, usage, and typical algorithms for each." },

  { type: "h2", text: "2. Then came Machine Learning" },
  { type: "p", text: "Traditional computer programs work something like this: Rules + Data → Answer. Humans tell the computer exactly what to do." },
  { type: "p", text: "Machine Learning turns the idea around: Data + Desired outcome → Learned rules/model. Instead of manually writing every rule, we give the computer examples and allow it to discover patterns." },
  { type: "p", text: "Let's take spam email. With traditional programming, you might write rules such as \"if the email contains 'FREE MONEY' → spam,\" then another for \"CLICK NOW,\" then another for suspicious senders, and another, and another. Very quickly, you would need thousands of rules." },
  { type: "p", text: "Machine Learning takes a different approach. You give the system thousands — or millions — of emails that humans have already labelled:" },
  { type: "table", headers: ["Email", "Label"], rows: [["\"Meeting at 3 PM\"", "Not spam"], ["\"Your bank statement is ready\"", "Not spam"], ["\"WIN $10,000 NOW!!!\"", "Spam"], ["\"Congratulations! Claim your prize\"", "Spam"], ["\"Project meeting tomorrow\"", "Not spam"]] },
  { type: "p", text: "The algorithm examines these examples and discovers patterns. It might learn that certain combinations of words, sender characteristics, formatting patterns and other signals are associated with spam. You don't explicitly tell it every rule — the machine learns the rules from the data. That's Machine Learning." },

  { type: "h2", text: "3. So is Machine Learning AI?" },
  { type: "p", text: "Yes. Machine Learning is a subset of Artificial Intelligence. You can think about it like this:" },
  { type: "diagram", text: "ARTIFICIAL INTELLIGENCE\n│\n├── Rule-based systems\n│\n├── Search & planning\n│\n├── Expert systems\n│\n├── Machine Learning\n│   │\n│   ├── Decision trees\n│   ├── Linear models\n│   ├── Random forests\n│   ├── Support Vector Machines\n│   └── Neural networks\n│\n└── Other approaches" },
  { type: "callout", text: "All Machine Learning is AI, but not all AI is Machine Learning. This distinction is one of the most important things to understand." },

  { type: "image", src: assetUrl("/articles/ai-vs-ml-vs-dl/nested-simple.jpeg"), alt: "Three concentric ellipses labeled Artificial Intelligence, Machine Learning, and Deep Learning, each fully containing the next." },

  { type: "h2", text: "4. Where does Deep Learning enter the picture?" },
  { type: "p", text: "Now we go one level deeper. Deep Learning is a subset of Machine Learning. It uses a particular type of mathematical model called a neural network — the name comes from the fact that these systems were loosely inspired by the way biological brains process information." },
  { type: "p", text: "Don't take the analogy too literally, though. An artificial neural network isn't a tiny digital brain. Instead, it is a mathematical system made up of interconnected computational units called neurons, arranged in layers. A simplified network might look like:" },
  { type: "diagram", text: "Input\n  ↓\nLayer 1\n  ↓\nLayer 2\n  ↓\nLayer 3\n  ↓\nOutput" },
  { type: "p", text: "Because there can be many layers between the input and output, we call these systems deep neural networks. Hence: Deep Learning." },

  { type: "image", src: assetUrl("/articles/ai-vs-ml-vs-dl/nested-icons.jpeg"), alt: "Nested circles labeled Artificial Intelligence, Machine Learning, and Deep Learning, illustrated with a robot, gears, and a circuit-board head icon." },

  { type: "h2", text: "5. Why does Deep Learning matter?" },
  { type: "p", text: "Let's return to our spam example. A traditional Machine Learning model might require humans to decide which characteristics of an email are important — number of links, number of capital letters, presence of certain words, sender reputation, email length. These are called features. A human might engineer these features and then train a Machine Learning model using them." },
  { type: "p", text: "Deep Learning can sometimes learn useful representations directly from relatively raw data. That's particularly powerful for things such as images, speech, video, natural language, and complex patterns." },
  { type: "p", text: "Consider image recognition. Suppose we want a system to recognize cats. A traditional approach might attempt to explicitly measure: does the image have two triangular ears? Does it have whiskers? Is there a certain shape around the eyes? That's difficult because real-world images vary enormously." },
  { type: "p", text: "A deep neural network can instead learn increasingly complex patterns through its layers. Conceptually:" },
  { type: "diagram", text: "Raw image\n   ↓\nEdges\n   ↓\nShapes\n   ↓\nTextures / parts\n   ↓\nEyes / ears / faces\n   ↓\n\"Cat\"" },
  { type: "p", text: "The network doesn't necessarily learn these exact human-interpretable stages, but this is a useful intuition for understanding hierarchical representation learning." },

  { type: "h2", text: "6. The famous nested relationship" },
  { type: "p", text: "Now we can put everything together." },
  { type: "image", src: assetUrl("/articles/ai-vs-ml-vs-dl/nested-detailed.jpeg"), alt: "Detailed nested-circle diagram of AI, Machine Learning, and Deep Learning with callouts: mimics human intelligence, learns from data, neural networks.", caption: "This is a conceptual diagram represented as proportions for visualization — not a measurement of the AI field. The chart is illustrative, not a claim about the actual percentage of AI that falls into each category." },
  { type: "p", text: "The conceptual relationship is better expressed this way:" },
  { type: "diagram", text: "┌───────────────────────────────────────────┐\n│                                           │\n│        ARTIFICIAL INTELLIGENCE            │\n│                                           │\n│     ┌───────────────────────────────┐     │\n│     │       MACHINE LEARNING        │     │\n│     │                               │     │\n│     │    ┌───────────────────┐      │     │\n│     │    │   DEEP LEARNING   │      │     │\n│     │    │                   │      │     │\n│     │    └───────────────────┘      │     │\n│     │                               │     │\n│     └───────────────────────────────┘     │\n│                                           │\n└───────────────────────────────────────────┘" },
  { type: "callout", text: "Deep Learning ⊂ Machine Learning ⊂ Artificial Intelligence — that single line explains most of the confusion." },

  { type: "h2", text: "7. A simple analogy: learning to cook" },
  { type: "p", text: "Let's forget technology for a moment. Imagine someone wants to build a machine that can cook." },
  { type: "p", text: "AI — \"make the machine intelligent.\" The broad objective is to make the machine capable of preparing food and making decisions about cooking. You could give it a cookbook containing thousands of explicit instructions. That's an AI system, even if it isn't learning." },
  { type: "p", text: "Machine Learning — \"let it learn from experience.\" Instead of giving it every recipe, you show it thousands of examples: ingredients, cooking temperatures, cooking times, previous results, human ratings. Over time, it learns patterns — it might discover that when certain ingredients are combined and cooked a certain way, people tend to like the result. That's analogous to Machine Learning." },
  { type: "p", text: "Deep Learning — \"let a deep neural network discover complex patterns.\" Now imagine feeding a neural network enormous amounts of information: recipes, images, videos, ingredient combinations, cooking results, human preferences. The network can learn extremely complex relationships. That's analogous to Deep Learning." },
  { type: "p", text: "The analogy isn't perfect — but it gives you the hierarchy." },

  { type: "h2", text: "8. A real-world example: your phone's face recognition" },
  { type: "p", text: "Consider Face ID or another modern facial recognition system. At a very high level, the system needs to answer: \"Is this person the authorized user?\" That's an AI task." },
  { type: "p", text: "The system can use Machine Learning to learn patterns that distinguish faces. And modern computer vision systems commonly use Deep Learning models to extract highly complex visual representations. So you can describe the relationship as:" },
  { type: "diagram", text: "AI problem\n  ↓\nMachine Learning approach\n  ↓\nDeep Learning technique" },
  { type: "p", text: "This pattern appears everywhere in modern AI." },

  { type: "h2", text: "9. What about ChatGPT?" },
  { type: "p", text: "This is where things get particularly interesting. Systems such as ChatGPT are examples of modern AI systems built using deep learning. At a simplified level:" },
  { type: "diagram", text: "Artificial Intelligence\n        ↓\nMachine Learning\n        ↓\nDeep Learning\n        ↓\nNeural Networks\n        ↓\nTransformer architecture\n        ↓\nLarge Language Models\n        ↓\nGenerative AI applications" },
  { type: "p", text: "A Large Language Model, or LLM, is trained on enormous amounts of data to learn patterns in language. When you type \"Explain quantum computing to me like I'm five,\" the model isn't simply looking up a pre-written answer — it generates a response based on patterns it learned during training and the context provided in the conversation." },
  { type: "p", text: "There are many additional components involved in modern AI products, but the important point for this article is: LLMs are built using deep learning, which is a branch of machine learning, which itself sits within AI." },

  { type: "h2", text: "10. But wait — does AI always mean Machine Learning?" },
  { type: "p", text: "No. This is where many explanations become misleading. AI existed as a field long before today's Machine Learning boom. Early AI researchers explored things such as logic, search, symbolic reasoning, knowledge representation, planning, and expert systems." },
  { type: "p", text: "Imagine a chess program. One approach could involve explicitly encoding strategies and rules. Another could involve searching possible future moves. Neither necessarily requires modern Machine Learning." },
  { type: "callout", text: "\"AI = Machine Learning\" is incorrect. A better statement: Machine Learning is one major approach to Artificial Intelligence." },

  { type: "h2", text: "11. And does Machine Learning always mean Deep Learning?" },
  { type: "p", text: "Again: no. There are many Machine Learning algorithms that aren't deep neural networks. For example:" },
  { type: "p", text: "Decision Trees — a model can make decisions through a tree-like structure:" },
  { type: "diagram", text: "        Income?\n       /       \\\n    High       Low\n     ↓          ↓\n  Risk?       Risk?" },
  { type: "list", items: ["Random Forests — multiple decision trees can work together to produce a prediction.", "Linear Regression — a mathematical model can estimate relationships between variables.", "Logistic Regression — it can be used for classification problems.", "Support Vector Machines — these can separate different categories based on mathematical boundaries."] },
  { type: "p", text: "None of these automatically qualifies as Deep Learning. Therefore: Deep Learning is Machine Learning, but Machine Learning is much bigger than Deep Learning." },

  { type: "h2", text: "12. Why did Deep Learning suddenly become so important?" },
  { type: "p", text: "This is one of the most fascinating parts of the story. Deep Learning isn't entirely new — neural networks have been studied for decades. But several things came together: more data (the internet, smartphones, sensors and digital services generated enormous amounts of it), more computing power (GPUs and specialized AI hardware made huge numbers of mathematical operations efficient), better algorithms (improved architectures, training techniques, optimization methods), and better software (frameworks such as PyTorch and TensorFlow made experimentation significantly easier)." },
  { type: "callout", text: "More data + more compute + better algorithms = much more capable Deep Learning systems." },
  { type: "p", text: "This helped produce breakthroughs in image recognition, speech recognition, translation, computer vision, generative AI, and large language models." },

  { type: "h2", text: "13. Where does Generative AI fit?" },
  { type: "p", text: "This is another term that causes confusion. Generative AI is not a replacement for AI, ML or Deep Learning — it's better thought of as a category of AI systems whose primary purpose is to generate new content." },
  { type: "table", headers: ["Technology", "Example output"], rows: [["Generative AI", "Text"], ["Generative AI", "Images"], ["Generative AI", "Music"], ["Generative AI", "Video"], ["Generative AI", "Code"]] },
  { type: "p", text: "A modern image generator might use deep learning. A modern language model might use deep learning. So you can have: AI → ML → Deep Learning → Generative AI application. But not every AI system is generative — a fraud detection model, for example, might simply output \"Fraud: Yes/No.\" It doesn't need to generate an essay or image." },

  { type: "h2", text: "14. A useful family tree" },
  { type: "p", text: "Here's a more complete mental model:" },
  { type: "diagram", text: "                         ARTIFICIAL INTELLIGENCE\n                                  │\n             ┌────────────────────┴────────────────────┐\n             │                                         │\n       Rule-based AI                              Machine Learning\n                                                         │\n                                      ┌──────────────────┴─────────────┐\n                                      │                                │\n                               Traditional ML                    Deep Learning\n                                      │                                │\n                         ┌────────────┼───────┐                Neural Networks\n                         │            │       │                       │\n                    Regression    Trees     SVM              Transformers\n                                                                  │\n                                                                  ↓\n                                                        Large Language Models\n                                                                  │\n                                                                  ↓\n                                                           Generative AI" },
  { type: "p", text: "This isn't intended as a complete taxonomy — AI is a huge field and these categories can overlap — but it's a useful map for beginners." },

  { type: "h2", text: "15. An everyday example: YouTube recommendations" },
  { type: "p", text: "Let's say YouTube recommends a video you actually enjoy. At the highest level, this is an AI application. Machine Learning models can analyze signals such as videos you've watched, how long you watched them, videos you skipped, searches you've made, topics you interact with, and similar users' behaviour." },
  { type: "p", text: "The system learns patterns from huge quantities of data. Depending on the particular component, those models may include traditional Machine Learning and/or Deep Learning. The result: AI application → using ML → potentially using Deep Learning. The user doesn't see any of this — they simply see \"Recommended for you.\"" },

  { type: "h2", text: "16. Another example: self-driving cars" },
  { type: "p", text: "Self-driving technology makes the hierarchy even easier to understand. The overall goal — AI: make the vehicle capable of navigating and making decisions. Different components may use different techniques." },
  { type: "list", items: ["Computer vision — Deep Learning can help recognize cars, pedestrians, traffic signs, road markings, traffic lights.", "Prediction — Machine Learning can help estimate how other road users might behave.", "Planning — other AI techniques can determine possible routes and actions."] },
  { type: "p", text: "So a sophisticated autonomous vehicle isn't simply \"a Deep Learning system.\" It can be an AI system containing many different technologies." },

  { type: "h2", text: "17. The biggest misconception: \"AI learns everything\"" },
  { type: "p", text: "This is probably the most common misunderstanding. People sometimes imagine: \"AI is basically a computer that thinks like a human.\" Reality is much more nuanced." },
  { type: "p", text: "An AI system is usually designed for a particular task or collection of tasks. A spam classifier doesn't suddenly know how to drive a car. A chess-playing AI doesn't automatically know how to diagnose a disease. An image recognition model doesn't inherently understand economics. And even modern LLMs have capabilities and limitations determined by their training, architecture, tools and operating environment." },
  { type: "p", text: "So \"intelligence\" in AI doesn't necessarily mean human-like general intelligence." },

  { type: "h2", text: "18. AI doesn't necessarily \"understand\" things the way humans do" },
  { type: "p", text: "This distinction becomes particularly important with modern generative AI. When an LLM produces a beautifully written explanation, it can feel as though a person is sitting behind the screen. But the underlying system is fundamentally a mathematical model trained to identify and generate patterns." },
  { type: "p", text: "That doesn't mean its behaviour is trivial — modern models can perform surprisingly sophisticated tasks. But we should distinguish what a system can do from how humans intuitively imagine it is doing it. That's why technical discussions about AI often require more precision than simply saying \"the computer understands it.\"" },

  { type: "h2", text: "19. So why do companies use all three terms?" },
  { type: "p", text: "Because each term describes a different level of the technology. Imagine a company says \"We are an AI company\" — that's a broad statement. If it says \"We use Machine Learning,\" that's more specific. If it says \"We use Deep Learning,\" that's more specific still. And if it says \"We use Transformer-based Large Language Models,\" now we're talking about a much more specific technology." },
  { type: "p", text: "It's similar to saying: Vehicle → Car → Electric Car → Tesla Model. Each description can be correct, but each provides a different level of detail." },

  { type: "h2", text: "20. The easiest way to remember everything" },
  { type: "p", text: "If you remember only four sentences from this article, remember these:" },
  { type: "list", items: ["Artificial Intelligence — the broad goal of making machines perform tasks associated with intelligence.", "Machine Learning — a way of achieving AI by allowing machines to learn patterns from data.", "Deep Learning — a branch of Machine Learning based primarily on multi-layer neural networks.", "Generative AI — AI systems designed to generate new content such as text, images, audio, video or code."] },
  { type: "p", text: "And the relationship is: AI is the big umbrella. Machine Learning is one major section underneath it. Deep Learning is a section inside Machine Learning. Many modern Generative AI systems are built using Deep Learning." },

  { type: "image", src: assetUrl("/articles/ai-vs-ml-vs-dl/core-concepts.jpeg"), alt: "Dark-themed infographic titled 'AI vs. ML vs. DL: The Core Concepts', showing AI, Machine Learning, and Deep Learning as three overlapping circles around a neural-network icon." },

  { type: "h2", text: "21. The bigger picture" },
  { type: "p", text: "The evolution can almost be viewed as a journey:" },
  { type: "diagram", text: "                 \"Can machines behave intelligently?\"\n                              │\n                              ▼\n                    ARTIFICIAL INTELLIGENCE\n                              │\n                              ▼\n                 \"Can machines learn from data?\"\n                              │\n                              ▼\n                     MACHINE LEARNING\n                              │\n                              ▼\n             \"Can neural networks learn complex\n                     representations?\"\n                              │\n                              ▼\n                       DEEP LEARNING\n                              │\n                              ▼\n             \"Can these models generate useful\n                       new content?\"\n                              │\n                              ▼\n                     GENERATIVE AI" },
  { type: "p", text: "And that's why the terminology can feel confusing. They aren't competing technologies — they describe different levels of the same technological landscape." },

  { type: "h2", text: "The one-line mental model" },
  { type: "p", text: "If someone asks you tomorrow, \"What's the difference between AI, Machine Learning and Deep Learning?\" you can simply say:" },
  { type: "callout", text: "AI is the broad field. Machine Learning is a way of building AI by learning from data. Deep Learning is a type of Machine Learning that uses deep neural networks." },
  { type: "p", text: "That's the hierarchy. AI → ML → DL. Three terms. One nested family. And once you understand that relationship, a surprisingly large amount of today's AI terminology starts making sense." },
];
