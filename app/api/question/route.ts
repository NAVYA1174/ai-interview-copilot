import { mockQuestions } from "@/lib/mockQuestions";

export async function GET() {
  const random =
    mockQuestions[Math.floor(Math.random() * mockQuestions.length)];

  const variations = [
    "Let's start with: " + random.question,
    "Explain this: " + random.question,
    "Tell me about: " + random.question,
  ];

  return Response.json({
    id: random.id,
    question: variations[Math.floor(Math.random() * variations.length)],
    keywords: random.keywords,
  });
}