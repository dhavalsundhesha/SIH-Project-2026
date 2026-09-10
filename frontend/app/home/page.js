"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import api from "../../lib/api";
import { getToken, getStoredUser } from "../../lib/auth";

const TILES = [
  { href: "/explore", icon: "📖", title: "Explore Bharat", desc: "Travel across India's states" },
  { href: "/museum", icon: "🏺", title: "Artifacts Museum", desc: "Collect ancient treasures" },
  { href: "/quiz", icon: "🎯", title: "Quiz", desc: "Test your knowledge" },
  { href: "/missions", icon: "⚔️", title: "Missions", desc: "Complete heritage quests" },
  { href: "/mittu-ai", icon: "🦜", title: "Mittu AI", desc: "Chat with your guide" },
  { href: "/awards", icon: "🏆", title: "Awards", desc: "See your badges" },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!getToken()) {
      router.push("/");
      return;
    }
    const stored = getStoredUser();
    if (!stored?.guardianType) {
      router.push("/guardian-select");
      return;
    }
    setUser(stored);
    api.get("/auth/me").catch(() => {});
  }, [router]);

  if (!user) return null;

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold text-dharo-gold">
          Welcome back, {user.name} 🙏
        </h1>
        <p className="text-dharo-muted mt-1">
          Continue your journey through India's living heritage.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {TILES.map((t) => (
            <Link key={t.href} href={t.href} className="panel p-5 hover:border-dharo-gold/50 transition">
              <div className="text-3xl">{t.icon}</div>
              <p className="font-display font-bold text-lg mt-2 text-dharo-text">{t.title}</p>
              <p className="text-dharo-muted text-sm mt-0.5">{t.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
