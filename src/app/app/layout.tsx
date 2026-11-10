"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobiStore } from "@/lib/state";
import OnboardingModal from "@/components/shared/OnboardingModal";
import CampusLoadingScreen from "@/components/shared/CampusLoadingScreen";
import { MobiMark } from "@/components/shared/MobiLogo";
import {
  Home,
  Compass,
  Recycle,
  Calendar,
  MessageSquare,
  Wallet,
  Megaphone,
  Bell,
  Sparkles,
} from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile } = useMobiStore();
  const [showLoader, setShowLoader] = useState(true);

  // Check session storage to show loading screen once per session
  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("mobi_loaded_session");
    if (hasLoaded) {
      setShowLoader(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("mobi_loaded_session", "true");
    setShowLoader(false);
  };

  const NAV_ITEMS = [
    { href: "/app", icon: Home, label: "Dashboard" },
    { href: "/app/map", icon: Compass, label: "3D Map" },
    { href: "/app/eco", icon: Recycle, label: "MOBI ECO" },
    { href: "/app/events", icon: Calendar, label: "Events" },
    { href: "/app/connect", icon: MessageSquare, label: "Connect" },
    { href: "/app/wallet", icon: Wallet, label: "Wallet" },
    { href: "/app/campus-connect", icon: Megaphone, label: "Notices" },
  ];

  return (
    <div className="min-h-screen bg-[#F4EEDC] p-2 sm:p-4 lg:p-6 flex items-center justify-center font-sans antialiased text-[#181514] selection:bg-[#EEA827] selection:text-black">
      {/* Decorative Halftone Background Pattern */}
      <div className="fixed inset-0 retro-halftone opacity-15 pointer-events-none" />

      {showLoader && <CampusLoadingScreen onComplete={handleLoadingComplete} />}
      <OnboardingModal />

      {/* Main Neo-Brutalist Frame Container */}
      <div className="w-full max-w-[1440px] bg-[#FAF3E0] rounded-[28px] sm:rounded-[38px] border-[2.5px] border-black shadow-[6px_6px_0px_#000] sm:shadow-[8px_8px_0px_#000] p-3 sm:p-5 lg:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 min-h-[92vh] relative overflow-hidden">
        
        {/* Sidebar (Desktop & Tablet) */}
        <aside className="hidden md:flex flex-col justify-between items-center bg-[#24201E] text-white rounded-[24px] w-16 lg:w-20 py-5 px-2 shrink-0 border-2 border-black shadow-[4px_4px_0px_#000] select-none z-20">
          {/* Brand Logo */}
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/"
              className="w-11 h-11 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
              title="Return to Landing Page"
            >
              <MobiMark className="w-11 h-11" />
            </Link>

            {/* Nav Icons */}
            <nav className="flex flex-col items-center gap-2.5">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all group relative ${
                      isActive
                        ? "bg-[#EEA827] text-black border-2 border-black shadow-[3px_3px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                        : "text-[#FAF3E0]/70 hover:text-white hover:bg-white/10 active:scale-95"
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <span className="absolute -left-1 w-1.5 h-4 bg-[#D84F2A] border border-black rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Profile Avatar */}
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/app"
              className="w-10 h-10 rounded-full bg-[#1D838F] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-white font-black text-sm uppercase transition-transform hover:scale-105"
              title={`Student: ${profile.fullName || "Student"}`}
            >
              {profile.fullName?.charAt(0) || "M"}
            </Link>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between bg-[#24201E] text-white p-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] z-20">
          <Link href="/" className="flex items-center gap-2.5">
            <MobiMark className="w-8 h-8" />
            <div>
              <span className="text-sm font-black tracking-tight text-white block leading-tight">
                MOBI
              </span>
              <span className="text-[9px] font-bold text-[#EEA827] tracking-wider uppercase block">
                EVERGREEN CAMPUS
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/app/campus-connect"
              className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20"
            >
              <Bell className="w-4 h-4" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#1D838F] border-2 border-black text-white flex items-center justify-center text-xs font-black">
              {profile.fullName?.charAt(0) || "M"}
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 z-10">
          {children}
        </main>

        {/* Mobile Bottom Navigation Dock */}
        <nav className="md:hidden fixed bottom-3 left-3 right-3 bg-[#FAF3E0] border-2 border-black rounded-2xl p-2 flex items-center justify-around shadow-[4px_4px_0px_#000] z-40">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-xl flex flex-col items-center gap-0.5 transition-all ${
                  isActive
                    ? "bg-[#EEA827] text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                    : "text-stone-700 hover:text-black"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
