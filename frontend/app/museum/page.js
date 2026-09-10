"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";
import { getStoredUser, saveSession, getToken } from "../../lib/auth";

const RARITY_STYLES = {
  legendary: "border-yellow-500/50 bg-yellow-500/5 text-yellow-400",
  epic: "border-purple-500/50 bg-purple-500/5 text-purple-400",
  rare: "border-teal-500/50 bg-teal-500/5 text-teal-400",
};

const RARITY_ICON = { legendary: "⭐", epic: "💜", rare: "💎" };

export default function MuseumPage() {
  const [artifacts, setArtifacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [collecting, setCollecting] = useState(false);

  async function load() {
    const { data } = await api.get("/artifacts");
    setArtifacts(data);
    if (data.length && !selected) setSelected(data[0]);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const collectedCount = artifacts.filter((a) => a.collected).length;
  const filtered = filter === "all" ? artifacts : artifacts.filter((a) => a.rarity === filter);

  async function handleCollect(artifact) {
    if (!getToken()) return;
    setCollecting(true);
    try {
      const { data } = await api.post(`/artifacts/${artifact._id}/collect`);
      if (!data.alreadyCollected) {
        const user = getStoredUser();
        user.xp += data.xpEarned;
        user.level = data.newLevel;
        saveSession(getToken(), user);
      }
      await load();
      setSelected((prev) => (prev ? { ...prev, collected: true } : prev));
    } finally {
      setCollecting(false);
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-dharo-gold text-center">ARTIFACTS MUSEUM</h1>
        <p className="text-center text-dharo-muted mt-1">Discover and collect priceless artifacts from India's ancient past!</p>
        <p className="text-center text-dharo-gold font-semibold mt-2">
          🏺 Collected: {collectedCount}/{artifacts.length}
        </p>

        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {[
            { key: "all", label: "All Artifacts" },
            { key: "legendary", label: "⭐ Legendary" },
            { key: "epic", label: "💜 Epic" },
            { key: "rare", label: "💎 Rare" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                filter === f.key
                  ? "bg-dharo-gold text-dharo-bg border-dharo-gold font-semibold"
                  : "border-dharo-border text-dharo-muted hover:text-dharo-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
            {filtered.map((a) => (
              <button
                key={a._id}
                onClick={() => setSelected(a)}
                className={`panel p-4 text-left relative transition hover:border-dharo-gold/50 ${
                  selected?._id === a._id ? "border-dharo-gold" : ""
                } ${RARITY_STYLES[a.rarity]}`}
              >
                {a.collected && (
                  <span className="absolute top-3 right-3 text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full px-2 py-0.5">
                    ✓ Collected
                  </span>
                )}
                <div className="text-3xl">{a.icon}</div>
                <p className="text-xs mt-2 flex items-center gap-1">
                  {RARITY_ICON[a.rarity]} <span className="capitalize">{a.rarity}</span>
                </p>
                <p className="font-display font-bold text-dharo-text mt-1">{a.name}</p>
                <p className="text-dharo-muted text-xs mt-0.5">{a.era} · {a.location}</p>
              </button>
            ))}
          </div>

          {selected && (
            <div className={`panel p-6 h-fit sticky top-24 ${RARITY_STYLES[selected.rarity]}`}>
              <div className="text-4xl">{selected.icon}</div>
              <p className="text-xs mt-2 flex items-center gap-1">
                {RARITY_ICON[selected.rarity]} <span className="capitalize">{selected.rarity}</span>
              </p>
              <h2 className="font-display text-xl font-bold text-dharo-text mt-1">{selected.name}</h2>
              <p className="text-dharo-muted text-sm">{selected.era} · {selected.location}</p>

              <p className="text-dharo-text/90 text-sm mt-4 leading-relaxed">{selected.description}</p>

              <div className="bg-dharo-panelLight rounded-lg p-4 mt-5">
                <p className="text-dharo-gold text-xs font-semibold">Collect Reward</p>
                <p className="text-dharo-text font-display text-lg">+{selected.xpReward} XP</p>
              </div>

              {selected.collected ? (
                <button disabled className="w-full mt-4 py-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold">
                  ✓ Already Collected!
                </button>
              ) : (
                <button
                  onClick={() => handleCollect(selected)}
                  disabled={collecting}
                  className="gold-btn w-full mt-4 py-2.5"
                >
                  {collecting ? "Collecting…" : "🏺 Collect Artifact!"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
