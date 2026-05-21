"use client";

import { useEffect, useState } from "react";

type Message = {
  role: "ai" | "user";
  text: string;
};

type Attempt = {
  question: string;
  score: number;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [history, setHistory] = useState<Attempt[]>([]);

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Use Chrome");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event: any) => {
      setAnswer(event.results[0][0].transcript);
    };
  };

  const fetchQuestion = async () => {
    const res = await fetch("/api/question");
    const data = await res.json();

    setQuestionId(data.id);
    setMessages((prev) => [...prev, { role: "ai", text: data.question }]);
    setAnswer("");
    setScore(null);
    setFeedback("");
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const submitAnswer = async () => {
    const currentQuestion =
      messages.find((m) => m.role === "ai")?.text || "";

    setMessages((p) => [...p, { role: "user", text: answer }]);

    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: questionId, answer }),
    });

    const data = await res.json();

    setScore(data.score);
    setFeedback(data.feedback);

    setHistory((p) => [
      ...p,
      { question: currentQuestion, score: data.score },
    ]);

    setAnswer("");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">
        🚀 AI Interview Copilot
      </h1>

      {/* CHAT BOX */}
      <div className="w-full max-w-2xl h-[420px] overflow-y-auto bg-zinc-900 p-4 rounded-xl border border-zinc-700">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`my-2 flex ${
              msg.role === "ai" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                msg.role === "ai"
                  ? "bg-zinc-700 text-white"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <textarea
        className="w-full max-w-2xl mt-4 p-3 rounded-lg text-black"
        rows={3}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type or speak your answer..."
      />

      {/* BUTTONS */}
      <div className="flex gap-3 mt-3">
        <button
          onClick={submitAnswer}
          className="bg-green-600 px-4 py-2 rounded-lg"
        >
          Submit
        </button>

        <button
          onClick={fetchQuestion}
          className="bg-blue-600 px-4 py-2 rounded-lg"
        >
          Next
        </button>

        <button
          onClick={startVoiceInput}
          className="bg-purple-600 px-4 py-2 rounded-lg"
        >
          🎤 Speak
        </button>
      </div>

      {/* SCORE */}
      {score !== null && (
        <div className="mt-4 bg-zinc-900 p-4 rounded-xl w-full max-w-2xl">
          <h2 className="text-xl">Score: {score}</h2>
          <p className="text-gray-300">{feedback}</p>
        </div>
      )}

      {/* DASHBOARD */}
      <div className="mt-6 w-full max-w-2xl">
        <h2 className="text-xl mb-2">📊 Performance</h2>

        <p className="mb-2">
          Avg Score:{" "}
          {history.length
            ? Math.round(
                history.reduce((a, b) => a + b.score, 0) /
                  history.length
              )
            : 0}
        </p>

        {history.map((h, i) => (
          <div
            key={i}
            className="bg-zinc-800 p-3 rounded-lg mb-2"
          >
            <p className="text-sm text-gray-300">{h.question}</p>
            <p className="text-green-400">Score: {h.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}