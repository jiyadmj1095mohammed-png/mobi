"use client";

import { useEffect, useState } from "react";
import { Leaf, Sparkles, ArrowRight, Compass, ShieldCheck } from "lucide-react";
import { MobiMark } from "@/components/shared/MobiLogo";

export default function CampusLoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    const totalDuration = 1800; // Snappy 1.8 seconds!
    const intervalTime = 25;
    const step = 100 / (totalDuration / intervalTime);

    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        const next = current + step;
        if (next >= 100) {
          window.clearInterval(progressTimer);
          window.setTimeout(() => {
            setIsDismissing(true);
            window.setTimeout(() => onComplete?.(), 250);
          }, 100);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      window.clearInterval(progressTimer);
    };
  }, [onComplete]);

  const skip = () => {
    setIsDismissing(true);
    window.setTimeout(() => onComplete?.(), 150);
  };

  const percentage = Math.min(100, Math.round(progress));

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#F4EEDC] font-sans transition-opacity duration-300 ${
        isDismissing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Retro Halftone Dots & Decorative Background Shapes */}
      <div className="absolute inset-0 retro-halftone opacity-20 pointer-events-none" />

      {/* Playful Floating Retro Shapes */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full border-2 border-black bg-[#EEA827] shadow-[4px_4px_0px_#000] hidden sm:flex items-center justify-center -rotate-12">
        <Sparkles className="w-10 h-10 text-black animate-spin" style={{ animationDuration: "12s" }} />
      </div>
      <div className="absolute bottom-12 right-12 w-28 h-28 rounded-2xl border-2 border-black bg-[#1D838F] shadow-[5px_5px_0px_#000] hidden sm:flex items-center justify-center rotate-6">
        <Compass className="w-12 h-12 text-white animate-pulse" />
      </div>
      <div className="absolute top-1/4 right-16 w-12 h-12 bg-[#D84F2A] border-2 border-black shadow-[3px_3px_0px_#000] -rotate-45 hidden md:block" />

      {/* Main Retro-Brutalist Card */}
      <main className="relative w-full max-w-[480px] bg-[#FAF3E0] border-[3px] border-black rounded-[28px] shadow-[8px_8px_0px_#000] overflow-hidden p-6 sm:p-8">
        {/* Top Accent Strip */}
        <div className="bg-[#D84F2A] border-b-[2.5px] border-black -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 px-6 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#EEA827] border border-black inline-block" />
            <span className="text-xs font-black tracking-wider uppercase">MEA Engineering College</span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black/30 border border-white/20">
            MOBI OS
          </span>
        </div>

        {/* Center Mascot / Icon */}
        <div className="pt-6 pb-4 flex flex-col items-center text-center">
          <div className="relative mb-5">
            {/* Brand Emblem */}
            <div className="w-20 h-20 rounded-2xl bg-black border-[2.5px] border-black shadow-[4px_4px_0px_#000] flex items-center justify-center -rotate-3 transition-transform hover:rotate-0 overflow-hidden">
              <MobiMark className="w-16 h-16" />
            </div>
            {/* Mini Star Badge */}
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#1D838F] border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center text-white text-xs font-black">
              ✦
            </div>
          </div>

          {/* Bold Retro Headings */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                MOBI
              </span>
              <span className="bg-[#1D838F] text-white text-xs sm:text-sm font-black uppercase px-2.5 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_#000] -rotate-2">
                CAMPUS
              </span>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#D84F2A]">
                READY
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-stone-600">
              3D Navigation • Eco Rewards • Student Connect
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="w-full space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs font-black text-black">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#D84F2A] animate-ping" />
                Initializing campus graph...
              </span>
              <span className="bg-[#FAF3E0] px-2 py-0.5 border border-black rounded-md font-black">
                {percentage}%
              </span>
            </div>

            {/* Retro Segmented / Chunky Progress Bar */}
            <div className="w-full h-5 bg-white border-2 border-black rounded-full overflow-hidden p-0.5 shadow-[2px_2px_0px_#000]">
              <div
                className="h-full bg-gradient-to-r from-[#EEA827] via-[#D84F2A] to-[#1D838F] rounded-full transition-all duration-75 border-r-2 border-black"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Quick Skip Button */}
          <div className="mt-6 w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1D838F]" />
              Verified Campus Core
            </div>
            <button
              onClick={skip}
              className="brutal-btn bg-[#EEA827] hover:bg-[#F0A500] text-black text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5"
            >
              <span>Enter Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
