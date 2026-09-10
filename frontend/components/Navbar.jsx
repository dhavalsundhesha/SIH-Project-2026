"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredUser, clearSession } from "../lib/auth";
import { useRouter, usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: "🏛️" },
  { href: "/explore", label: "Explore", icon: "📖" },
  { href: "/stories", label: "Stories", icon: "📜" },
  { href: "/quiz", label: "Quiz", icon: "🎯" },
  { href: "/missions", label: "Missions", icon: "⚔️" },
  { href: "/museum", label: "Museum", icon: "🏺" },
  { href: "/mittu-ai", label: "Mittu AI", icon: "🦜" },
  { href: "/awards", label: "Awards", icon: "🏆" },
];

// XP needed to reach the *next* level, given the level formula used on the backend
function xpNeededForLevel(level) {
  return level * level * 100;
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getStoredUser());
  }, [pathname]);

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  if (!user) return null;

  const currentLevelFloor = xpNeededForLevel(user.level - 1);
  const nextLevelCeiling = xpNeededForLevel(user.level);
  const progressPct = Math.min(
    100,
    Math.round(((user.xp - currentLevelFloor) / (nextLevelCeiling - currentLevelFloor)) * 100)
  );

  return (
    <nav className="sticky top-0 z-40 bg-dharo-panel border-b border-dharo-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        <Link href="/home" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🪔</span>
          <div>
            <p className="font-display font-bold text-dharo-gold leading-none text-lg tracking-wide">DHAROHAR</p>
            <p className="text-[10px] text-dharo-muted leading-none">Bharat Guardian</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1 text-sm flex-1 justify-center">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                pathname === item.href
                  ? "bg-dharo-gold/20 text-dharo-gold border border-dharo-gold/40"
                  : "text-dharo-muted hover:text-dharo-text hover:bg-dharo-panelLight"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-dharo-gold font-semibold">⭐ {user.xp} XP</span>
              <span className="text-emerald-400 font-semibold">Lv.{user.level}</span>
              <span className="text-orange-400 font-semibold">🔥 {user.streak?.current ?? 0}</span>
            </div>
            <div className="w-32 h-1.5 bg-dharo-border rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-dharo-gold" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="w-9 h-9 rounded-full bg-dharo-panelLight border border-dharo-border flex items-center justify-center text-dharo-muted hover:text-dharo-text"
          >
            ✕
          </button>
        </div>
      </div>
    </nav>
  );
}
