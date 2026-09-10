"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";

export default function ExplorePage() {
  const [states, setStates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [xpToast, setXpToast] = useState(null);

  useEffect(() => {
    api.get("/states").then(({ data }) => setStates(data));
  }, []);

  async function handleSelect(state) {
    setSelected(state);
    try {
      const { data } = await api.post(`/states/${state._id}/explore`);
      if (data.xpEarned > 0) {
        setXpToast(`+${data.xpEarned} XP — ${state.name} unlocked!`);
        setTimeout(() => setXpToast(null), 3000);
      }
    } catch {
      // exploring still works visually even if not logged in / offline
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-dharo-gold text-center">EXPLORE BHARAT</h1>
        <p className="text-center text-dharo-muted mt-1">
          Click on any state to discover its culture, food, art and heritage!
        </p>

        {xpToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-dharo-gold text-dharo-bg font-semibold px-4 py-2 rounded-lg shadow-lg z-50">
            {xpToast}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="panel p-4 relative" style={{ minHeight: 480 }}>
            <p className="text-xs text-dharo-muted absolute top-4 left-4">INDIA</p>
            <p className="text-xs text-dharo-muted absolute top-4 right-4">Click a state →</p>

            <div className="relative w-full h-full" style={{ minHeight: 400 }}>
              {states.map((s) => (
                <button
                  key={s._id}
                  onClick={() => handleSelect(s)}
                  title={s.name}
                  style={{ left: `${s.mapPosition?.x ?? 50}%`, top: `${s.mapPosition?.y ?? 50}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition
                    ${selected?._id === s._id ? "border-dharo-gold bg-dharo-gold/20 scale-110" : "border-dharo-border bg-dharo-panelLight hover:border-dharo-gold/60"}
                  `}
                >
                  {s.icon}
                </button>
              ))}
            </div>

            <div className="absolute bottom-4 left-4 text-xs text-dharo-muted">
              States shown: {states.length} · <span className="text-dharo-gold">Click to explore</span>
            </div>
          </div>

          <div className="panel p-6 flex flex-col">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-dharo-muted">
                <div className="text-4xl mb-3">🗺️</div>
                <p className="font-display text-lg text-dharo-gold">SELECT A STATE</p>
                <p className="text-sm mt-1 max-w-xs">
                  Click on any dot on the map or button below to explore that state!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl">{selected.icon}</div>
                <h2 className="font-display text-2xl font-bold mt-2 text-dharo-text">{selected.name}</h2>
                <p className="text-dharo-muted text-sm">{selected.region} India</p>

                <div className="space-y-3 mt-4 text-sm">
                  <Detail label="Culture" value={selected.culture} />
                  <Detail label="Food" value={selected.food} />
                  <Detail label="Art" value={selected.art} />
                  <Detail label="Heritage" value={selected.heritage} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
          {states.map((s) => (
            <button
              key={s._id}
              onClick={() => handleSelect(s)}
              className="panel px-4 py-3 text-left flex items-center gap-2 hover:border-dharo-gold/50 transition"
            >
              <span>{s.icon}</span>
              <span className="text-sm">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-dharo-gold text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-dharo-text/90 mt-0.5">{value}</p>
    </div>
  );
}
