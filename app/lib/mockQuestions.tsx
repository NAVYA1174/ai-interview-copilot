import { mockQuestions } from "@/lib/mockQuestions";

export async function GET() {
  const random =
    mockQuestions[Math.floor(Math.random() * mockQuestions.length)];

  return Response.json({
    id: random.id,
    question: random.question,
    keywords: random.keywords,
  });
}