import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { generateContent, ContentAgentError, type GenerationType } from "@/lib/contentAgent";
import { calculateGenerationCostInPaise, suggestedPriceInPaise, type Provider } from "@/lib/agentPricing";

const VALID_TYPES: GenerationType[] = ["QUIZ", "ARTICLE", "ROADMAP"];
const VALID_PROVIDERS: Provider[] = ["anthropic", "openai", "ollama"];

// Kicks off a draft — never publishes directly. See ContentGenerationJob
// in prisma/schema.prisma and the review note in src/lib/contentAgent.ts.
// anthropic/openai are unverified end to end here (no API key in this
// environment); ollama was run for real against a local instance during
// this build (see AGENT_COSTS.md) and is the recommended default for this
// admin-only, human-reviewed drafting step — free, and quality-checked by
// you before anything goes live either way.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { type, topic, provider } = body ?? {};

  if (!VALID_TYPES.includes(type) || typeof topic !== "string" || !topic.trim() || !VALID_PROVIDERS.includes(provider)) {
    return NextResponse.json({ error: "type (QUIZ/ARTICLE/ROADMAP), provider (anthropic/openai/ollama), and topic are required" }, { status: 400 });
  }

  const job = await prisma.contentGenerationJob.create({
    data: { type, topic, provider, requestedBy: session!.user!.id!, status: "PENDING" },
  });

  try {
    const result = await generateContent(type, topic, provider);
    const costInPaise = calculateGenerationCostInPaise(provider, result.inputTokens, result.outputTokens);
    const suggestedPrice = suggestedPriceInPaise(costInPaise);

    const [updated] = await prisma.$transaction([
      prisma.contentGenerationJob.update({
        where: { id: job.id },
        data: {
          status: "DONE",
          resultJson: result.content as object,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
          costInPaise,
          suggestedPriceInPaise: suggestedPrice,
        },
      }),
      // Real spend, auto-tracked — this is the "cost I had to incur"
      // half of the accounting ask, for this specific line item.
      prisma.ledgerEntry.create({
        data: {
          type: "EXPENSE",
          amountInPaise: costInPaise,
          category: "ai_generation",
          description: `${provider}/${result.model} — ${type} draft: "${topic}"`,
        },
      }),
    ]);

    return NextResponse.json({ job: updated });
  } catch (err) {
    const message = err instanceof ContentAgentError ? err.message : "Generation failed.";
    const updated = await prisma.contentGenerationJob.update({
      where: { id: job.id },
      data: { status: "FAILED", errorMessage: message },
    });
    return NextResponse.json({ job: updated, error: message }, { status: 502 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const jobs = await prisma.contentGenerationJob.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({ jobs });
}
