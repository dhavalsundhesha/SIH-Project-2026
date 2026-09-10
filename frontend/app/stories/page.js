"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";
import { getStoredUser, saveSession, getToken } from "../../lib/auth";

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [active, setActive] = useState(null);
  const [marked, setMarked] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get("/stories").then(({ data }) => setStories(data));
  }, []);

  async function openStory(summary) {
    setMarked(false);
    const { data } = await api.get(`/stories/${summary._id}`);
    setActive(data);
  }

  async function markRead() {
    if (!getToken() || marked) return;
    const { data } = await api.post(`/stories/${active._id}/read`);
    const user = getStoredUser();
    if (user) {
      user.xp += data.xpEarned;
      user.level = data.newLevel;
      saveSession(getToken(), user);
    }
    setMarked(true);
    setToast(`+${data.xpEarned} XP for reading!`);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-dharo-gold text-center">TALES OF BHARAT</h1>
        <p className="text-center text-dharo-muted mt-1">Short stories from India's civilizational history.</p>

        {toast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-dharo-gold text-dharo-bg font-semibold px-4 py-2 rounded-lg shadow-lg z-50">
            {toast}
          </div>
        )}

        {!active && (
          <div className="space-y-4 mt-8">
            {stories.map((s) => (
              <button
                key={s._id}
                onClick={() => openStory(s)}
                className="panel p-5 w-full text-left flex items-center gap-4 hover:border-dharo-gold/50 transition"
              >
                <span className="text-3xl">{s.coverIcon}</span>
                <div>
                  <p className="font-display font-bold text-dharo-text">{s.title}</p>
                  <p className="text-dharo-muted text-xs mt-0.5">{s.era} · +{s.xpReward} XP</p>
                </div>
              </button>
            ))}
            {stories.length === 0 && <p className="text-center text-dharo-muted">No stories yet — seed the database to add some!</p>}
          </div>
        )}

        {active && (
          <div className="panel p-6 mt-8">
            <button onClick={() => setActive(null)} className="text-dharo-muted text-sm mb-4">← Back to stories</button>
            <div className="text-4xl">{active.coverIcon}</div>
            <h2 className="font-display text-2xl font-bold text-dharo-text mt-2">{active.title}</h2>
            <p className="text-dharo-muted text-sm">{active.era}</p>
            <p className="text-dharo-text/90 leading-relaxed mt-5 whitespace-pre-line">{active.body}</p>

            {marked ? (
              <button disabled className="w-full mt-6 py-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold">
                ✓ Read
              </button>
            ) : (
              <button onClick={markRead} className="gold-btn w-full mt-6 py-2.5">
                Mark as Read (+{active.xpReward} XP)
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
