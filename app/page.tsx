"use client";

import { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState("");
  const [role, setRole] = useState("react");
  const [scores, setScores] = useState<string[]>([]);

  const getQuestion = async () => {
    const res = await fetch(`/api/question?role=${role}`);
    const data = await res.json();
    setQuestion(data.question);
  };

  const startInterview = async () => {
    setStarted(true);
    setAnswer("");
    setResult("");
    await getQuestion();
  };

  const speak = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setAnswer(text);
    };
  };

  const evaluateAnswer = async () => {
    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer, role }),
    });

    const data = await res.json();

    setResult(data.result);
    setScores((prev) => [...prev, data.result]);
  };

  return (
    <div
      style={{
        padding: 40,
        textAlign: "center",
        fontFamily: "Arial",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 15,
      }}
    >
      <h1>🤖 AI Interview Copilot</h1>

      {/* ROLE SELECTOR */}
      {!started && (
        <div style={{ marginBottom: 20 }}>
          <h3>Select Role</h3>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: 10 }}
          >
            <option value="react">React Developer</option>
            <option value="node">Node.js Developer</option>
            <option value="python">Python Developer</option>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
          </select>
        </div>
      )}

      {!started ? (
        <button onClick={startInterview} style={{ padding: 10 }}>
          Start Interview
        </button>
      ) : (
        <>
          <h2>📌 Role: {role.toUpperCase()}</h2>

          <h3>Question:</h3>
          <p style={{ fontSize: 18 }}>{question}</p>

          <button onClick={() => speak(question)} style={{ padding: 8 }}>
            🔊 Hear Question
          </button>

          <button onClick={startVoice} style={{ padding: 8 }}>
            🎤 Speak Answer
          </button>

          <p>
            <b>Your Answer:</b> {answer}
          </p>

          <button onClick={evaluateAnswer} style={{ padding: 10 }}>
            📊 Evaluate Answer
          </button>

          {/* RESULT BOX */}
          {result && (
            <div
              style={{
                marginTop: 20,
                padding: 15,
                border: "1px solid #ccc",
                borderRadius: 10,
                maxWidth: 500,
                textAlign: "left",
              }}
            >
              <h3>📊 AI Evaluation</h3>
              <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
            </div>
          )}

          {/* DASHBOARD */}
          {scores.length > 0 && (
            <div
              style={{
                marginTop: 30,
                padding: 15,
                border: "2px solid #ddd",
                borderRadius: 10,
                maxWidth: 500,
                textAlign: "left",
              }}
            >
              <h3>📊 Performance Dashboard</h3>

              {scores.map((s, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 10,
                    padding: 10,
                    background: "#f5f5f5",
                    borderRadius: 8,
                  }}
                >
                  <b>Interview {i + 1}</b>
                  <pre style={{ whiteSpace: "pre-wrap" }}>{s}</pre>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button onClick={getQuestion}>➡️ Next Question</button>

            <button
              onClick={() => {
                setStarted(false);
                setQuestion("");
                setAnswer("");
                setResult("");
              }}
            >
              ❌ End Interview
            </button>
          </div>
        </>
      )}
    </div>
  );
}