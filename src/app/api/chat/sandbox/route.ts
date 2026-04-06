import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { getScenario } from "@/config/aiLabScenarios";

export const runtime = "edge";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export async function POST(req: Request) {
  const { messages, scenarioId } = (await req.json()) as {
    messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
    scenarioId: string;
  };

  const scenario = getScenario(scenarioId);
  if (!scenario) {
    return new Response(
      JSON.stringify({ error: "Unknown scenario" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: scenario.systemPrompt,
    messages,
    temperature: 0.4,
    maxOutputTokens: 512,
  });

  return result.toTextStreamResponse();
}
