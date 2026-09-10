"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { getStoredUser, saveSession, getToken } from "../../lib/auth";
import Navbar from "../../components/Navbar";

export default function GuardianSelectPage() {
  const router = useRouter();
  const [guardians, setGuardians] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.push("/");
      return;
    }
    api.get("/guardians").then(({ data }) => {
      setGuardians(data);
      if (data.length) setSelectedKey(data[0].key);
    });
  }, [router]);

  const selected = guardians.find((g) => g.key === selectedKey);

  async function confirmGuardian() {
    setSaving(true);
    setError("");
    try {
      const { data } = await api.put("/auth/guardian", { guardianType: selectedKey });
      saveSession(getToken(), data);
      router.push("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save your guardian choice.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-center text-dharo-muted text-sm">Choose Your Path</p>
        <h1 className="font-display text-4xl font-bold text-center text-dharo-gold mt-1">
          CHOOSE YOUR GUARDIAN
        </h1>
        <p className="text-center text-dharo-muted max-w-xl mx-auto mt-3">
          Each guardian has unique powers and unlocks special content. Choose the path that calls to your heart!
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="grid grid-cols-2 gap-4">
            {guardians.map((g) => (
              <button
                key={g.key}
                onClick={() => setSelectedKey(g.key)}
                className={`panel p-5 text-left relative transition hover:border-dharo-gold/60 ${
                  selectedKey === g.key ? "border-emerald-500/70 bg-emerald-500/5" : ""
                }`}
              >
                {selectedKey === g.key && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-dharo-gold text-dharo-bg text-xs flex items-center justify-center">
                    ✓
                  </span>
                )}
                <div className="text-3xl">{g.icon}</div>
                <p className="font-display font-bold text-lg mt-2 text-dharo-text">{g.name}</p>
                <p className="text-dharo-muted text-sm">{g.hindiName}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {g.skillTags.map((tag) => (
                    <span key={tag} className="text-[11px] bg-dharo-panelLight border border-dharo-border rounded-full px-2 py-0.5 text-dharo-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="panel p-6">
              <div className="text-4xl">{selected.icon}</div>
              <h2 className="font-display text-2xl font-bold mt-3 text-dharo-text">{selected.name}</h2>
              <p className="text-dharo-muted">{selected.hindiName}</p>
              <p className="text-dharo-text/90 mt-4 leading-relaxed">{selected.description}</p>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mt-5">
                <p className="text-emerald-400 text-xs font-semibold tracking-wide">✨ {selected.specialPowerTitle}</p>
                <p className="text-dharo-text mt-1">{selected.specialPower}</p>
              </div>

              <div className="mt-5 space-y-3">
                {Object.entries(selected.baseStats).map(([stat, value]) => (
                  <div key={stat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-dharo-muted">{stat}</span>
                      <span className="text-dharo-text">{value}%</span>
                    </div>
                    <div className="w-full h-2 bg-dharo-border rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

              <button onClick={confirmGuardian} disabled={saving} className="gold-btn w-full py-3 mt-6">
                {saving ? "Saving…" : `Become ${selected.name}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
