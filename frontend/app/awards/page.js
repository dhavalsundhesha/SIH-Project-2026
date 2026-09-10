"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";

export default function AwardsPage() {
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    api.get("/awards").then(({ data }) => setAwards(data));
  }, []);

  const unlockedCount = awards.filter((a) => a.unlocked).length;

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-dharo-gold text-center">GUARDIAN AWARDS</h1>
        <p className="text-center text-dharo-muted mt-1">
          🏆 Unlocked: {unlockedCount}/{awards.length}
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {awards.map((a) => (
            <div
              key={a._id}
              className={`panel p-5 text-center ${a.unlocked ? "border-dharo-gold/60" : "opacity-50"}`}
            >
              <div className="text-4xl">{a.icon}</div>
              <p className="font-display font-bold mt-2 text-dharo-text">{a.name}</p>
              <p className="text-dharo-muted text-xs mt-1">{a.description}</p>
              <p className="text-[11px] text-dharo-muted/70 mt-2 italic">{a.criteria}</p>
              {a.unlocked && <p className="text-emerald-400 text-xs mt-2">✓ Unlocked</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
