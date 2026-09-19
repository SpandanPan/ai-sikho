// Full content for the "Chatbot or Agent? The Difference That Actually
// Matters" article. Same typed-block approach as aiVsMlVsDl.ts — see that
// file's header comment for why.

import type { ArticleBlock } from "./aiVsMlVsDl";

export const heroImage = { src: "/articles/chatbot-or-agent/hero.png", alt: "Two robots at a desk: one labeled Chatbot with a speech bubble reading \"Here's the answer!\", the other labeled AI Agent wearing a cape, pointing at a checklist reading Plan steps, Search information, Use tools, Take actions, Adjust if needed, Complete the goal.", width: 1212, height: 530 };

export const blocks: ArticleBlock[] = [
  { type: "p", text: "You've probably interacted with both. You ask: \"What's the weather in Bangalore today?\" A system gives you an answer." },
  { type: "p", text: "Then you ask: \"Find me a good restaurant nearby, check whether there's a table for four tonight at 8 PM, and book it.\" Now something very different may need to happen. The system has to understand what you want, search for restaurants, compare options, check availability, perhaps ask you a clarification, make a reservation, and confirm what it did." },
  { type: "p", text: "That difference is at the heart of the increasingly popular distinction between chatbots and AI agents." },
  { type: "callout", text: "A chatbot primarily responds. An agent can pursue a goal by deciding what steps to take and using tools to take them." },
  { type: "p", text: "But there's an important catch: the line isn't as simple as \"chatbot = simple, agent = smart.\" Modern chatbots can use tools. Agents can have conversations. And many real-world systems sit somewhere in between. Let's break it down." },

  { type: "h2", text: "1. What is a chatbot?" },
  { type: "p", text: "At its simplest, a chatbot is a system designed to have a conversation with you. You send something in. It processes your request. It sends something back." },
  { type: "diagram", text: "You\n ↓\nQuestion\n ↓\nChatbot\n ↓\nAnswer\n ↓\nYou" },
  { type: "p", text: "For example: You: \"What is Machine Learning?\" Chatbot: \"Machine Learning is a branch of AI where computers learn patterns from data...\" That's a chatbot doing exactly what it was designed to do. It communicates." },

  { type: "h2", text: "2. Chatbots don't have to be \"dumb\"" },
  { type: "p", text: "When people hear \"chatbot,\" they sometimes imagine an old customer-support bot: \"Press 1 for billing. Press 2 for technical support.\" That's only one type of chatbot." },
  { type: "p", text: "Modern chatbots can be powered by sophisticated Large Language Models. They can:" },
  { type: "list", items: ["Explain complex topics", "Summarize documents", "Write code", "Translate languages", "Analyze information", "Answer questions", "Hold long conversations", "Understand images", "Generate content"] },
  { type: "p", text: "A modern ChatGPT-style system is vastly more capable than the traditional rule-based chatbot. But the core interaction can still be: you ask → it responds." },

  { type: "h2", text: "3. Then what is an AI agent?" },
  { type: "p", text: "An AI agent goes one step further. Instead of only answering your question, an agent can be given a goal and determine how to accomplish it." },
  { type: "p", text: "Think about the difference. Request A: \"What are the best laptops under ₹1 lakh?\" — a system can research the options and tell you. Request B: \"Find me a laptop under ₹1 lakh that is good for AI development, compare five options, check current prices, and prepare a shortlist.\" Now the system potentially needs to perform several actions:" },
  { type: "diagram", text: "Understand goal\n      ↓\nSearch for laptops\n      ↓\nFilter by price\n      ↓\nCheck specifications\n      ↓\nCompare GPUs / RAM / storage\n      ↓\nEvaluate against requirements\n      ↓\nCreate shortlist\n      ↓\nExplain recommendation" },
  { type: "p", text: "That is much closer to agentic behaviour." },

  { type: "h2", text: "4. The biggest difference: conversation vs. action" },
  { type: "p", text: "A useful way to think about it: a chatbot's job is \"tell me something,\" an agent's job is \"get something done.\" A chatbot's primary job is often to produce a response. An agent's primary job is to achieve an objective — and that objective may require multiple steps." },

  { type: "h2", text: "5. Imagine hiring two assistants" },
  { type: "p", text: "Assistant #1, the knowledgeable receptionist: you say \"What flights are available from Bangalore to Delhi tomorrow?\" They answer. You ask which one is cheapest. They answer. You ask about baggage allowance. They answer. This is very much like a chatbot." },
  { type: "p", text: "Assistant #2, the personal travel assistant: you say \"I need to get to Delhi tomorrow for a meeting. Find me a reasonably priced flight that gets me there before 10 AM, book it, and put the details in my calendar.\" The assistant searches flights, filters them, compares prices, checks arrival times, selects an option based on your preferences, books the ticket, adds it to your calendar, and sends you the itinerary." },
  { type: "callout", text: "You didn't specify every step. You gave them an outcome. They figured out the path. That's much closer to an AI agent." },

  { type: "h2", text: "6. The \"loop\" is what makes agents interesting" },
  { type: "p", text: "A simple chatbot often looks like this:" },
  { type: "diagram", text: "User\n  ↓\nModel\n  ↓\nResponse" },
  { type: "p", text: "An agent can look more like:" },
  { type: "diagram", text: "              ┌───────────────┐\n              │     Goal      │\n              └───────┬───────┘\n                      ↓\n                  AI Model\n                      ↓\n               Decide next step\n                      ↓\n                  Use a tool\n                      ↓\n                 Get result\n                      ↓\n             Think about result\n                      ↓\n             Decide next step\n                      │\n              ┌───────┴───────┐\n              │               │\n           Finished?        Continue\n              │               │\n             Yes              └──────→\n              ↓\n            Result" },
  { type: "p", text: "The important part is the loop. The agent can observe → decide → act → observe → decide → act, until it reaches the goal — or determines that it can't." },

  { type: "h2", text: "7. Tools are a huge part of the story" },
  { type: "p", text: "An LLM by itself is primarily a reasoning and language system. But an agent can give that model access to tools:" },
  { type: "list", items: ["Information tools — web search, database queries, document search, knowledge bases", "Action tools — send an email, create a calendar event, update a CRM, create a ticket, make a reservation, run code", "Business tools — check inventory, generate an invoice, process an application, retrieve customer information, update an insurance claim"] },
  { type: "p", text: "This changes what the AI can actually do." },

  { type: "h2", text: "8. Think of the AI model as the brain — and tools as the hands" },
  { type: "p", text: "This analogy isn't perfect, but it's useful. Imagine an employee sitting at a desk. They have knowledge and reasoning ability. But they can't do much without access to the company's systems. Now give them email, browser, database, calculator, CRM, calendar, internal documents — suddenly they can accomplish much more. An AI agent works in a similar way." },
  { type: "diagram", text: "                AI Agent\n                    │\n        ┌───────────┼───────────┐\n        ↓           ↓           ↓\n      Model       Tools       Memory\n        │           │           │\n   Reasoning     Actions     Context" },
  { type: "p", text: "The model decides what should happen. The tools allow the system to actually do things." },

  { type: "h2", text: "9. Here's where things get confusing" },
  { type: "p", text: "You might now think: \"So if a chatbot uses a tool, it's an agent.\" Not necessarily — this is where the terminology becomes fuzzy." },
  { type: "p", text: "Suppose you ask \"What's the weather in Bangalore?\" The system calls a weather API and gives you the current temperature. It used a tool. But that doesn't necessarily mean you have a sophisticated autonomous agent — the system could simply follow a predetermined process:" },
  { type: "diagram", text: "User asks about weather\n        ↓\nCall weather API\n        ↓\nReturn result" },
  { type: "p", text: "There isn't much planning or autonomy involved. Compare that with: \"Plan me a three-day trip to Jaipur based on my budget, interests and travel dates.\" The system might need to search destinations, find hotels, check prices, look at opening hours, plan transportation, resolve conflicts, adjust the itinerary, and perhaps search again when something doesn't work. That's more agent-like." },

  { type: "h2", text: "10. So the difference isn't simply \"uses tools\"" },
  { type: "p", text: "A better distinction: how much responsibility does the system have for deciding and executing the steps needed to achieve the goal? Think of it as a spectrum." },
  { type: "diagram", text: "Less autonomy                                      More autonomy\n\nChatbot ───── Tool-using assistant ───── Agent ───── Agent system\n   │                    │                   │              │\n Answers            Calls tools        Plans steps    Coordinates\n questions           when asked        and acts       multiple agents" },
  { type: "p", text: "There isn't always a clean boundary. That's why two companies can describe similar products using different terminology." },

  { type: "h2", text: "11. A simple example: ordering food" },
  { type: "p", text: "You tell a chatbot: \"What are some good biryani restaurants in Bangalore?\" It gives you a list — primarily conversation and information retrieval." },
  { type: "p", text: "Now: \"Find me a biryani restaurant within 5 km that is open tonight and has good ratings.\" The system needs to search, filter and compare — more agentic." },
  { type: "p", text: "Now: \"Find me a restaurant for four people tonight at 8 PM, check availability, and book the best option.\" The system potentially has to understand preferences, search restaurants, filter distance, check opening hours, check availability, compare options, choose based on constraints, book, and confirm. That's a very different experience from simply answering questions." },

  { type: "h2", text: "12. Agents can also recover when things go wrong" },
  { type: "p", text: "Imagine an agent is asked to book a table for four at 8 PM. It checks — 8 PM is unavailable. A simple system might respond \"8 PM isn't available.\"" },
  { type: "p", text: "An agent could potentially reason: \"The user wants dinner around 8 PM. I'll check 7:30 PM and 8:30 PM.\" Then, finding 7:30 PM available, it could ask: \"8 PM isn't available, but 7:30 PM is. Would you like me to book it?\"" },
  { type: "callout", text: "That's not just answering. It's handling a task and adapting to the environment." },

  { type: "h2", text: "13. What does \"autonomous\" actually mean?" },
  { type: "p", text: "You'll hear the word autonomous constantly in discussions about agents. It doesn't necessarily mean \"the AI can do whatever it wants.\" It usually means the system can make some decisions without requiring the user to specify every individual step." },
  { type: "p", text: "For example, you say \"Prepare a weekly sales report.\" You don't necessarily tell it to open the database, run query A, run query B, calculate growth, create a chart, write a summary, and email the report. You specify the goal. The agent figures out some of the intermediate steps. That's autonomy." },

  { type: "h2", text: "14. But autonomy needs boundaries" },
  { type: "p", text: "This is extremely important in real-world AI systems. Imagine an AI agent with access to your bank account, your email, your company's database, your cloud infrastructure. You probably don't want \"do whatever you think is necessary\" — you want permissions." },
  { type: "table", headers: ["Action", "Permission"], rows: [["Read emails", "Allowed"], ["Draft emails", "Allowed"], ["Send emails", "Requires approval"], ["Transfer money", "Requires approval"], ["Delete files", "Not allowed"]] },
  { type: "p", text: "So production agents usually need permissions, guardrails, tool restrictions, human approval, monitoring, logging, and error handling. The more capable the agent becomes, the more important these controls become." },

  { type: "h2", text: "15. What about memory?" },
  { type: "p", text: "A simple chatbot might primarily work with the current conversation. An agent may need to remember things across steps or tasks — for example, \"My budget is ₹50,000, I prefer window seats, I don't like overnight flights, and I usually travel for work.\" An agent could use such information when planning future travel." },
  { type: "p", text: "There are different kinds of memory, and not every agent needs long-term memory. But memory can make an agent much more useful when working on tasks that extend over time." },

  { type: "h2", text: "16. What about planning?" },
  { type: "p", text: "Suppose you tell an AI: \"Organize a conference for 200 people.\" That's not one action — there could be hundreds of sub-tasks. A system might break it into:" },
  { type: "diagram", text: "Conference\n│\n├── Venue\n│\n├── Speakers\n│\n├── Food\n│\n├── Registration\n│\n├── Marketing\n│\n├── Travel\n│\n└── Budget" },
  { type: "p", text: "Then each section can have further tasks. This is where agentic systems become particularly interesting — instead of merely generating text about conference planning, the system can potentially work through the plan." },

  { type: "h2", text: "17. A chatbot can write the plan. An agent can execute parts of it." },
  { type: "p", text: "Ask a chatbot: \"Give me a five-step plan to launch a website.\" It might produce: define requirements, design website, build website, test it, deploy it. Useful." },
  { type: "p", text: "Now ask an agent to \"launch this website.\" If properly configured, it might inspect the repository, run tests, identify errors, fix certain issues, build the application, deploy it, check whether it is running, and report the result." },
  { type: "callout", text: "The second system isn't merely telling you what to do. It's participating in doing it." },

  { type: "h2", text: "18. Agents don't necessarily need a single AI model" },
  { type: "p", text: "An agent isn't necessarily one giant AI model. A real agentic system might contain:" },
  { type: "diagram", text: "                  Agent System\n                       │\n        ┌──────────────┼──────────────┐\n        ↓              ↓              ↓\n     LLM / Model      Tools         Memory\n        │              │              │\n        │        ┌─────┼─────┐        │\n        │        ↓     ↓     ↓        │\n        │       API   DB   Search     │\n        │\n        ↓\n     Planning\n        ↓\n   Decision loop" },
  { type: "p", text: "And larger systems may contain multiple specialized agents:" },
  { type: "diagram", text: "              Manager Agent\n                    │\n        ┌───────────┼───────────┐\n        ↓           ↓           ↓\n    Research      Coding      Review\n     Agent        Agent       Agent" },
  { type: "p", text: "One agent may research. Another may write code. Another may review the result. The manager coordinates them." },

  { type: "h2", text: "19. So what is \"Agentic AI\"?" },
  { type: "p", text: "You will increasingly hear the phrase Agentic AI. It's essentially describing AI systems designed to operate with a greater degree of goal orientation, planning, tool use, decision-making, multi-step execution, adaptation, and feedback." },
  { type: "p", text: "Rather than simply input → answer, the system may operate more like:" },
  { type: "diagram", text: "Goal → Plan → Act → Observe → Adjust → Act → Complete" },
  { type: "p", text: "That's the fundamental shift." },

  { type: "h2", text: "20. An important distinction: automation vs. agents" },
  { type: "p", text: "Suppose every morning at 9 AM, a script downloads a sales report, calculates revenue, creates a PDF, and emails it to your manager. That's automation. It may be extremely useful, but it doesn't necessarily need to be an AI agent — the workflow is predetermined." },
  { type: "diagram", text: "9 AM\n ↓\nRun A\n ↓\nRun B\n ↓\nRun C\n ↓\nSend email" },
  { type: "p", text: "Now imagine the system is told: \"Prepare the weekly sales report and highlight anything unusual.\" It might decide which data to examine, what counts as unusual, which additional data to retrieve, which charts to create, and what needs explanation. That's more agentic." },
  { type: "callout", text: "Automation follows a predefined path. An agent can determine parts of the path." },

  { type: "h2", text: "21. Another analogy: GPS vs. chauffeur" },
  { type: "p", text: "GPS: you tell it \"Take me from Bangalore to Mysore.\" It calculates a route. If there's traffic, it might recalculate. That's already somewhat adaptive." },
  { type: "p", text: "Chauffeur: you say \"Get me to Mysore before lunch.\" The chauffeur can decide when to leave, choose the route, refuel, adjust for traffic, stop if necessary, and change the route when conditions change. The second system has more responsibility for achieving the outcome — that's closer to the idea behind an agent." },

  { type: "h2", text: "22. Where do ChatGPT-style systems fit?" },
  { type: "p", text: "Modern AI assistants are increasingly hybrid systems. A system can behave like a chatbot in one interaction (\"Explain quantum computing\") and more like an agent in another (\"Research these five companies, compare their products, and prepare a report\"). The underlying model may be the same — what changes is tools, permissions, workflow, memory, planning, environment, and degree of autonomy." },
  { type: "p", text: "So asking \"Is ChatGPT a chatbot or an agent?\" doesn't always have a single useful answer. A better question is: \"What capabilities and level of autonomy has this particular system been given?\"" },

  { type: "h2", text: "23. The five questions that reveal whether you're using an agent" },
  { type: "p", text: "When someone tells you \"Our product is powered by AI agents,\" don't immediately be impressed by the word \"agent.\" Ask five simple questions:" },
  { type: "list", items: ["Does it have a goal? Can you give it an outcome rather than a narrowly defined question?", "Can it plan? Can it determine intermediate steps on its own?", "Can it use tools? Can it interact with APIs, databases, browsers, files or other systems?", "Can it execute multiple steps? Does it continue working rather than stopping after one response?", "Can it react to results? If something doesn't work, can it adjust its approach?"] },
  { type: "p", text: "The more of these capabilities a system genuinely has, the more agentic its behaviour becomes." },

  { type: "h2", text: "24. A practical comparison" },
  { type: "table", headers: ["", "Chatbot", "AI Agent"], rows: [
    ["Primary purpose", "Conversation", "Goal completion"],
    ["Answers questions", "✅", "✅"],
    ["Generates content", "✅", "✅"],
    ["Uses tools", "Sometimes", "Commonly"],
    ["Multi-step tasks", "Limited", "Core capability"],
    ["Planning", "Usually limited", "Common"],
    ["Takes actions", "Usually limited", "Yes, with permissions"],
    ["Adapts to results", "Limited", "Common"],
    ["Memory", "Optional", "Often useful"],
    ["Autonomy", "Lower", "Higher"],
    ["Human approval", "Usually implicit", "Often important for risky actions"],
  ] },
  { type: "p", text: "The table describes typical designs, not strict technical definitions. And that's important because \"agent\" isn't a magic technical category with one universally agreed checklist." },

  { type: "h2", text: "25. The real shift is from answers to outcomes" },
  { type: "p", text: "This is perhaps the most important idea in the entire article. Traditional software often asks: \"What input did the user provide?\" A chatbot asks: \"What should I say in response?\" An agent asks: \"What outcome is the user trying to achieve, and what do I need to do to achieve it?\" That's a fundamental change." },
  { type: "p", text: "Consider three requests. Level 1 — Information: \"What is GST?\" Answer. Level 2 — Assistance: \"Explain how I should file my GST return.\" Answer plus guidance. Level 3 — Action: \"Prepare everything required for my GST filing and tell me what needs my approval.\" Potentially an agentic workflow." },
  { type: "callout", text: "The further you move from information → assistance → execution, the more useful agentic systems can become." },

  { type: "h2", text: "26. But agents aren't automatically better" },
  { type: "p", text: "Sometimes you don't need an agent. If you ask \"What is photosynthesis?\" you don't need an autonomous AI system with access to 20 tools — you just need a good answer." },
  { type: "p", text: "Adding autonomy can introduce more complexity, more cost, more opportunities for errors, security risks, unexpected actions, and more difficult debugging. So the goal shouldn't be \"make everything an agent.\" The better question is: \"Does this problem actually benefit from autonomy and multi-step execution?\"" },

  { type: "h2", text: "27. A useful rule of thumb" },
  { type: "p", text: "Use a chatbot when you primarily need knowledge, explanation, conversation or content. Use an agentic system when you primarily need a goal accomplished across multiple steps and potentially multiple tools. Use traditional automation when the workflow is predictable and doesn't need dynamic decision-making." },
  { type: "table", headers: ["Problem", "Likely approach"], rows: [
    ["Explain a concept", "Chatbot"],
    ["Summarize a document", "Chatbot"],
    ["Answer FAQ", "Chatbot"],
    ["Generate an email", "Chatbot"],
    ["Send the email after approval", "Tool-enabled assistant"],
    ["Research several sources", "Agentic workflow"],
    ["Monitor systems and respond to incidents", "Agent"],
    ["Process a predictable daily report", "Automation"],
    ["Handle a complex investigation", "Agent"],
  ] },

  { type: "h2", text: "28. The future may not be \"chatbots vs. agents\"" },
  { type: "p", text: "It may be chat interfaces + models + tools + agents + humans working together. Imagine a future employee asking: \"Find out why our customer churn increased last quarter and prepare a report for tomorrow's leadership meeting.\"" },
  { type: "p", text: "The system could:" },
  { type: "diagram", text: "Understand the objective\n        ↓\nQuery analytics database\n        ↓\nCompare customer segments\n        ↓\nLook for unusual patterns\n        ↓\nRetrieve customer feedback\n        ↓\nAnalyze support tickets\n        ↓\nForm hypotheses\n        ↓\nCheck those hypotheses\n        ↓\nCreate charts\n        ↓\nDraft report\n        ↓\nAsk human to review\n        ↓\nFinalize" },
  { type: "p", text: "That's much more than a chatbot answering \"What is customer churn?\" It's a system participating in actual knowledge work." },

  { type: "h2", text: "29. The one-line mental model" },
  { type: "callout", text: "A chatbot is primarily designed to respond. An agent is designed to pursue a goal by deciding and executing a sequence of actions." },
  { type: "p", text: "Or even shorter: Chatbot → \"I'll tell you.\" Agent → \"I'll work on it.\"" },
  { type: "p", text: "But don't get trapped by the labels. A system can sit anywhere along the spectrum. The important questions are: what can it see? What can it decide? What tools can it use? What can it actually change? How many steps can it take without being told what to do next?" },
  { type: "p", text: "That's what tells you whether you're dealing with a simple chatbot, a tool-using assistant, or a genuinely agentic system. And as AI moves from answering questions to actually doing work, understanding that difference is going to matter a lot." },
];
