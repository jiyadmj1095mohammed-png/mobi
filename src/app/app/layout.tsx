"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobiStore } from "@/lib/state";
import OnboardingModal from "@/components/shared/OnboardingModal";
import CampusLoadingScreen from "@/components/shared/CampusLoadingScreen";
import {
  Home,
  Compass,
  Recycle,
  Calendar,
  MessageSquare,
  Wallet,
  Megaphone,
  Leaf,
  HelpCircle,
} from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile } = useMobiStore();
  const [showLoader, setShowLoader] = useState(true);

  // Check session storage to show 3-second loading screen once per session
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
    <div className="mobi-app min-h-screen bg-black p-2 sm:p-5 lg:p-7 flex items-center justify-center font-sans antialiased selection:bg-white selection:text-black">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.11),transparent_24%),radial-gradient(circle_at_88%_88%,rgba(255,255,255,0.07),transparent_28%)]" />
      {showLoader && <CampusLoadingScreen onComplete={handleLoadingComplete} />}
      <OnboardingModal />

      {/* Main Rounded App Card Container */}
      <div className="mobi-app-frame w-full max-w-[1440px] rounded-[32px] sm:rounded-[44px] border border-white/10 p-3 sm:p-5 lg:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 min-h-[92vh] relative overflow-hidden">
        {/* Sidebar (Desktop & Tablet) */}
        <aside className="hidden md:flex flex-col justify-between items-center bg-[linear-gradient(160deg,rgba(255,255,255,0.16),rgba(255,255,255,0.035)_45%,rgba(255,255,255,0.08))] text-white rounded-[28px] w-16 lg:w-20 py-5 px-2 shrink-0 border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_18px_48px_rgba(0,0,0,0.34)] backdrop-blur-2xl select-none">
          {/* Brand and navigation */}
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/app"
              className="mobi-brand-mark w-10 h-10 lg:w-11 lg:h-11 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/15 flex items-center justify-center transition-all"
              title="MOBI dashboard"
              aria-label="MOBI dashboard"
            >
              <Leaf className="w-5 h-5" />
            </Link>

            {/* Nav Icons */}
            <nav className="flex flex-col items-center gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-10 h-10 lg:w-11 lg:h-11 rounded-2xl flex items-center justify-center transition-all group relative ${
                      isActive
                        ? "mobi-nav-active bg-white/90 text-black shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/15"
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <span className="absolute -left-1 w-1 h-4 bg-white rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar links and profile */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/app/campus-connect"
              className="text-white/45 hover:text-white transition-colors"
              title="Noticeboard & Circulars"
            >
              <HelpCircle className="w-5 h-5" />
            </Link>

            <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl bg-white/15 text-white border border-white/15 font-extrabold flex items-center justify-center text-xs shadow-sm">
              {profile.fullName ? profile.fullName[0].toUpperCase() : "M"}
            </div>
          </div>
        </aside>

        {/* Mobile Top Header (Small Screens Only) */}
        <header className="md:hidden flex items-center justify-between px-2 pt-1 pb-2 border-b border-white/10 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xs">
              M
            </div>
            <span className="font-bold text-sm">MOBI</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white">
              Hello, {profile.fullName.split(" ")[0] || "Student"}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="mobi-app-content flex-1 overflow-y-auto max-h-[calc(92vh-2rem)] pr-1 sm:pr-2">
          {children}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-3 left-4 right-4 z-40 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06))] text-white rounded-3xl p-1.5 shadow-2xl flex justify-around items-center border border-white/20 backdrop-blur-2xl">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2.5 rounded-2xl transition-all ${
                  isActive ? "mobi-nav-active bg-white text-black" : "text-white/45"
                }`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
