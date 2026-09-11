"use client";

import { useState } from "react";
import api from "../../lib/api";

export default function MittuAI() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return;
    }

    const userMessage = message.trim();

    // Add user's message to UI
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      // Send message + previous conversation to backend
      const { data } = await api.post("/ai/mittu-chat", {
        message: userMessage,

        history: messages.map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [
            {
              text: m.content,
            },
          ],
        })),
      });

      // Add Mittu's answer
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      console.error("Mittu AI Error:", error);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Sorry, Mittu is unable to answer right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "8px" }}>
          Mittu AI 🦜
        </h1>

        <p style={{ color: "#666", marginBottom: "30px" }}>
          Ask Mittu anything about history, heritage, culture and more.
        </p>

        {/* Chat messages */}
        <div
          style={{
            minHeight: "400px",
            maxHeight: "500px",
            overflowY: "auto",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          {messages.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#888",
                paddingTop: "120px",
              }}
            >
              <h2>👋 Hello! I am Mittu.</h2>
              <p>Ask me a question to start chatting.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.role === "user"
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "12px 16px",
                  borderRadius: "14px",
                  background:
                    msg.role === "user"
                      ? "#2563eb"
                      : "#eeeeee",
                  color:
                    msg.role === "user"
                      ? "white"
                      : "#222",
                }}
              >
                <strong>
                  {msg.role === "user" ? "You" : "Mittu"}
                </strong>

                <div
                  style={{
                    marginTop: "5px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                padding: "12px 16px",
                color: "#666",
              }}
            >
              <strong>Mittu:</strong> Thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask Mittu anything..."
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              fontSize: "16px",
              outline: "none",
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading || !message.trim()}
            style={{
              padding: "14px 24px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}