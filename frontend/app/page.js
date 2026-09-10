"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { saveSession } from "../lib/auth";

export default function LandingPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function afterAuth(data) {
    saveSession(data.token, data.user);
    if (data.user.guardianType) {
      router.push("/home");
    } else {
      router.push("/guardian-select");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        const { data } = await api.post("/auth/login", { email: form.email, password: form.password });
        await afterAuth(data);
      } else {
        const { data } = await api.post("/auth/register", form);
        await afterAuth(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGuest() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/guest", { name: form.name });
      await afterAuth(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't start a guest session.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="text-4xl mb-3">🪔</div>
      <h1 className="font-display text-4xl md:text-5xl font-bold text-dharo-gold tracking-wide text-center">
        DHAROHAR
      </h1>
      <p className="text-dharo-goldLight text-sm tracking-[0.3em] mt-1">BHARAT GUARDIAN</p>
      <p className="text-dharo-muted mt-3 text-center max-w-md">
        Embark on an epic journey through Indian civilization!
      </p>

      <div className="panel w-full max-w-md mt-8 p-6">
        <div className="flex bg-dharo-panelLight rounded-lg p-1 mb-5">
          <button
            className={`flex-1 py-2 rounded-md font-semibold transition ${
              mode === "login" ? "bg-dharo-gold text-dharo-bg" : "text-dharo-muted"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-md font-semibold transition ${
              mode === "signup" ? "bg-dharo-gold text-dharo-bg" : "text-dharo-muted"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-dharo-text">Guardian Name</label>
            <input
              className="w-full bg-dharo-panelLight border border-dharo-border rounded-lg px-3 py-2.5 placeholder:text-dharo-muted focus:outline-none focus:border-dharo-gold"
              placeholder="Enter your name, young Guardian!"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required={mode === "signup"}
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm mb-1 text-dharo-text">Email</label>
              <input
                type="email"
                className="w-full bg-dharo-panelLight border border-dharo-border rounded-lg px-3 py-2.5 placeholder:text-dharo-muted focus:outline-none focus:border-dharo-gold"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
          )}

          {mode === "login" && (
            <div>
              <label className="block text-sm mb-1 text-dharo-text">Email</label>
              <input
                type="email"
                className="w-full bg-dharo-panelLight border border-dharo-border rounded-lg px-3 py-2.5 placeholder:text-dharo-muted focus:outline-none focus:border-dharo-gold"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1 text-dharo-text">Password</label>
            <input
              type="password"
              className="w-full bg-dharo-panelLight border border-dharo-border rounded-lg px-3 py-2.5 placeholder:text-dharo-muted focus:outline-none focus:border-dharo-gold"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="gold-btn w-full py-3 flex items-center justify-center gap-2">
            {loading ? "Please wait…" : <>⚔️ ENTER THE JOURNEY</>}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-dharo-border" />
          <span className="text-dharo-muted text-xs">or</span>
          <div className="flex-1 h-px bg-dharo-border" />
        </div>

        <button
          onClick={handleGuest}
          disabled={loading}
          className="w-full border border-dharo-gold/50 text-dharo-gold font-semibold py-2.5 rounded-lg hover:bg-dharo-gold/10 transition disabled:opacity-60"
        >
          🏛️ Continue as Guest
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6 w-full max-w-md">
        <div className="panel p-3 text-center">
          <p className="text-xl">📖</p>
          <p className="text-xs text-dharo-muted mt-1">Explore India</p>
        </div>
        <div className="panel p-3 text-center">
          <p className="text-xl">🎮</p>
          <p className="text-xs text-dharo-muted mt-1">Play Missions</p>
        </div>
        <div className="panel p-3 text-center">
          <p className="text-xl">🏆</p>
          <p className="text-xs text-dharo-muted mt-1">Earn Badges</p>
        </div>
      </div>
    </main>
  );
}
