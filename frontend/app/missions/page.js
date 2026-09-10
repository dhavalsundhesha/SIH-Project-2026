"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";
import { getStoredUser, saveSession, getToken } from "../../lib/auth";

export default function MissionsPage() {
  const [missions, setMissions] = useState([]);
  const [completing, setCompletingId] = useState(null);
  const [toast, setToast] = useState(null);

  async function load() {
    const { data } = await api.get("/missions");
    setMissions(data);
  }

  useEffect(() => { load(); }, []);

  async function handleComplete(mission) {
    setCompletingId(mission._id);
    try {
      const { data } = await api.post(`/missions/${mission._id}/complete`);
      if (!data.alreadyCompleted) {
        const user = getStoredUser();
        if (user) {
          user.xp += data.xpEarned;
          user.level = data.newLevel;
          saveSession(getToken(), user);
        }
        setToast(`+${data.xpEarned} XP — Mission complete!`);
        setTimeout(() => setToast(null), 3000);
      }
      await load();
    } finally {
      setCompletingId(null);
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-dharo-gold text-center">HERITAGE MISSIONS</h1>
        <p className="text-center text-dharo-muted mt-1">Step into the past and complete quests across Bharat.</p>

        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-dharo-gold text-dharo-bg font-semibold px-4 py-2 rounded-lg shadow-lg z-50">
            {toast}
          </div>
        )}

        <div className="space-y-5 mt-8">
          {missions.map((m) => (
            <div key={m._id} className="panel p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display font-bold text-lg text-dharo-text">{m.title}</p>
                  <p className="text-dharo-muted text-sm mt-1">{m.description}</p>
                </div>
                <span className="shrink-0 text-dharo-gold font-semibold text-sm">+{m.xpReward} XP</span>
              </div>

              <ol className="mt-4 space-y-1.5">
                {m.steps.map((step, i) => (
                  <li key={i} className="text-sm text-dharo-text/80 flex gap-2">
                    <span className="text-dharo-gold">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>

              {m.completed ? (
                <button disabled className="w-full mt-4 py-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold">
                  ✓ Completed
                </button>
              ) : (
                <button
                  onClick={() => handleComplete(m)}
                  disabled={completing === m._id}
                  className="gold-btn w-full mt-4 py-2.5"
                >
                  {completing === m._id ? "Completing…" : "Mark Mission Complete"}
                </button>
              )}
            </div>
          ))}
          {missions.length === 0 && (
            <p className="text-center text-dharo-muted">No missions yet — seed the database to add some!</p>
          )}
        </div>
      </div>
    </main>
  );
}
