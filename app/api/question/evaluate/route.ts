import { mockQuestions } from "@/lib/mockQuestions";

export async function POST(req: Request) {
  const { id, answer } = await req.json();

  const question = mockQuestions.find((q) => q.id === id);

  if (!question) {
    return Response.json({ error: "Invalid question" });
  }

  let score = 0;

  const text = answer.toLowerCase();

  question.keywords.forEach((k) => {
    if (text.includes(k)) score += 25;
  });

  if (text.length > 200) score += 10;
  if (text.includes("example")) score += 10;

  if (score > 100) score = 100;
  if (score < 10) score = 10;

  let feedback = "";

  if (score >= 80) feedback = "Excellent answer 🔥";
  else if (score >= 50) feedback = "Good answer 👍";
  else feedback = "Try adding more details";

  return Response.json({
    score,
    feedback,
  });
}