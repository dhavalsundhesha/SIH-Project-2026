"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";

export default function MittuAIPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste! I'm Mittu 🦜 — ask me anything about India's history, culture or heritage!" },
  ]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setStatus("loading");
    setErrorMsg("");

    try {
      const { data } = await api.post("/ai/mittu-chat", {
        message: text,
        history: nextMessages.slice(-8),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setStatus("idle");
    } catch (err) {
      const friendly =
        err.response?.status === 503
          ? "Mittu's AI brain isn't connected yet. Please check back soon!"
          : "Mittu couldn't think of a reply just now. Try again?";
      setErrorMsg(err.response?.data?.message || friendly);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex-1 flex flex-col">
        <div className="text-center mb-4">
          <div className="text-4xl">🦜</div>
          <h1 className="font-display text-2xl font-bold text-dharo-gold">Mittu AI</h1>
          <p className="text-dharo-muted text-sm">Your friendly heritage guide</p>
        </div>

        <div className="panel flex-1 p-4 overflow-y-auto space-y-3" style={{ minHeight: 400, maxHeight: 500 }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm ${
                  m.role === "user"
                    ? "bg-dharo-gold text-dharo-bg"
                    : "bg-dharo-panelLight border border-dharo-border text-dharo-text"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {status === "loading" && (
            <div className="flex items-center gap-2 text-dharo-muted text-sm">
              <span className="h-4 w-4 border-2 border-dharo-gold border-t-transparent rounded-full animate-spin" />
              Mittu is thinking…
            </div>
          )}

          {status === "error" && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {errorMsg}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 mt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Mittu about India's heritage…"
            className="flex-1 bg-dharo-panelLight border border-dharo-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-dharo-gold"
          />
          <button type="submit" disabled={status === "loading"} className="gold-btn px-5">
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
