import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

const EVALUATOR_SYSTEM = `You are a historical consistency evaluator for a wargaming simulation set in October 1898.
A player is role-playing as a White House aide during the Philippines decision.

They have submitted a free-form argument. Evaluate it on three dimensions:
1. HISTORICAL COHERENCE (0-3): Does it engage with real arguments from the 1898 debate?
   - References to Greene, Agoncillo, Hay, Foreman, Bourns, Bell, McKinley = good
   - Engages with actual stakes (Spain restoration, protectorate, annexation, independence) = good
   - Modern anachronisms or completely ahistorical framing = bad

2. STRATEGIC CLARITY (0-3): Is the argument internally consistent?
   - Does it follow from a premise to a conclusion?
   - Does it acknowledge the strongest counter-argument?

3. DIPLOMATIC REGISTER (0-3): Does it sound like a sophisticated 1898 policy argument?
   - Formal without being pompous
   - Treats adversary positions with seriousness
   - Not jingoistic, not naive

Return a JSON object with:
{
  "historicalCoherence": number,
  "strategicClarity": number,
  "diplomaticRegister": number,
  "total": number,
  "feedback": "2-3 sentences of specific feedback in Cortelyou's voice",
  "strengthPhrase": "The strongest phrase or idea in their argument, quoted",
  "weakSeam": "The weakest logical gap in one sentence"
}`;

export async function POST(req: NextRequest) {
  const { argument, characterId, thesis } = await req.json();

  const userMessage = `Character: ${characterId}
Recommended thesis: ${thesis}
Free-form argument: "${argument}"

Evaluate this argument.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{ role: 'user', content: userMessage }],
    system: EVALUATOR_SYSTEM,
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { feedback: text, total: 5 };
  }

  return NextResponse.json(parsed);
}
