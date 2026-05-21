import { mockQuestions } from "@/lib/mockQuestions";

export async function GET() {
  // fallback AI behavior (no API cost)
  const random = mockQuestions[Math.floor(Math.random() * mockQuestions.length)];

  // "AI-like expansion" (makes it feel dynamic)
  const variations = [
    "Let's start with: " + random.question,
    "Can you explain: " + random.question,
    "Tell me in detail: " + random.question,
  ];

  return Response.json({
    id: random.id,
    question: variations[Math.floor(Math.random() * variations.length)],
    keywords: random.keywords,
  });
}