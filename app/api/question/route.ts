import OpenAI from "openai";

export async function POST(req) {
  try {
    const { role } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an interviewer. Ask ONE ${role} interview question.`,
        },
      ],
    });

    return Response.json({
      question: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}