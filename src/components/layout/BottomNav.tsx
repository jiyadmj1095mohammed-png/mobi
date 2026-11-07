"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Recycle, Calendar, Wallet } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { href: "/app", label: "Home", icon: Home },
    { href: "/app/map", label: "Map", icon: Compass },
    { href: "/app/eco", label: "ECO", icon: Recycle },
    { href: "/app/events", label: "Events", icon: Calendar },
    { href: "/app/wallet", label: "Wallet", icon: Wallet },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#06251D]/95 backdrop-blur-lg border-t border-emerald-500/20 safe-pb shadow-lg">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-1 rounded-2xl transition-all ${
                isActive
                  ? "text-emerald-400 font-extrabold"
                  : "text-emerald-100/60 hover:text-emerald-300 font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? "bg-emerald-500/20 text-emerald-400" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
