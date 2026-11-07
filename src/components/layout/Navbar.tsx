"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobiStore } from "@/lib/state";
import { Leaf, Coins, MessageSquare, Shield, Compass, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { wallet, profile, isAdminView, toggleRole } = useMobiStore();
  const isMarketing = pathname === "/";

  return (
    <header className="sticky top-0 z-40 w-full bg-[#06251D]/90 backdrop-blur-md border-b border-emerald-500/20 text-white font-sans transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 flex items-center justify-center font-extrabold shadow-glow group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">MOBI</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                MEA
              </span>
            </div>
            <p className="text-[10px] text-emerald-300/70 -mt-0.5 tracking-wider font-medium hidden sm:block">
              Evergreen Future Campus
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-emerald-100/90">
          {[
            { href: "/app", label: "Dashboard" },
            { href: "/app/map", label: "3D Map" },
            { href: "/app/eco", label: "MOBI ECO" },
            { href: "/app/events", label: "Events" },
            { href: "/app/connect", label: "Connect" },
            { href: "/app/wallet", label: "Wallet" },
            { href: "/app/campus-connect", label: "Notices" },
          ].map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "hover:text-emerald-300 hover:bg-emerald-950/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Currency Pills & App Button */}
        <div className="flex items-center gap-2">
          {/* Mobi Coins Pill */}
          <Link
            href="/app/wallet"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 text-xs font-bold transition-all"
            title="Mobi Coins (For Event Discounts)"
          >
            <Coins className="w-3.5 h-3.5 text-emerald-400" />
            <span>{wallet.mobiCoins}</span>
          </Link>

          {/* Chat Points Pill */}
          <Link
            href="/app/wallet"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 text-xs font-bold transition-all"
            title="Chat Points (For Peer Chat)"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>{wallet.chatPoints}</span>
          </Link>

          {/* Enter MOBI CTA */}
          {isMarketing && (
            <Link
              href="/app"
              className="min-h-[38px] px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-glow"
            >
              <span>ENTER MOBI</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
