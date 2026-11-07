"use client";

import { useEffect, useState } from "react";
import { Sparkles, ShieldCheck, Terminal, Compass } from "lucide-react";

const QUOTES = [
  "Made by Students. For Students.",
  "One Campus. One Community. A Better Tomorrow.",
  "Building sustainable cleanliness at MEA Engineering College.",
  "Civic courtesy is the foundation of digital community.",
];

const TELEMETRY_CODES = [
  "MEA-NODE-8492 // PERINTHALMANNA",
  "GEO-GROUND-TRUTH: 11.0248° N, 76.2165° E",
  "19 CAMPUS WASTE SENSORS: ONLINE",
  "ANONYMOUS CIVIC PIPELINE: ENCRYPTED",
  "MOBI COINS REWARD LEDGER: READY",
];

export default function CampusLoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [codeIndex, setCodeIndex] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    // 3-second loader timer (3000ms)
    const totalDuration = 3000;
    const intervalTime = 30;
    const step = 100 / (totalDuration / intervalTime);

    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
      setCodeIndex((prev) => (prev + 1) % TELEMETRY_CODES.length);
    }, 1000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(progressTimer);
          clearInterval(quoteTimer);
          setTimeout(() => {
            setIsDismissing(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 400);
          }, 150);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(progressTimer);
      clearInterval(quoteTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0A0C0E] text-white flex flex-col items-center justify-between p-6 sm:p-10 transition-opacity duration-400 font-sans ${
        isDismissing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Header Badge */}
      <div className="w-full max-w-md flex items-center justify-between text-xs text-white/50 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#E8F876] text-[#121417] flex items-center justify-center font-bold text-xs">
            ✦
          </div>
          <span className="font-bold tracking-wider text-white">MOBI</span>
          <span className="text-[10px] text-white/40">MEA FUTURE CAMPUS</span>
        </div>
        <div className="font-mono text-[10px] text-[#E8F876] tracking-widest bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          SECURE PROTOCOL 2026
        </div>
      </div>

      {/* Center Cinematic Display */}
      <div className="w-full max-w-lg text-center space-y-6 my-auto px-4">
        {/* Concentric Pulsing Ring */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#E8F876]/30 animate-ping opacity-30" />
          <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#E8F876] flex items-center justify-center text-[#121417] font-black text-xs shadow-[0_0_20px_rgba(232,248,118,0.5)]">
              ✦
            </div>
          </div>
        </div>

        {/* Dynamic Rotating Campus Quote */}
        <div className="min-h-[60px] flex items-center justify-center">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug transition-all duration-300">
            &ldquo;{QUOTES[quoteIndex]}&rdquo;
          </h2>
        </div>

        {/* Live Campus Telemetry Code */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-[#E8F876] shadow-sm">
          <Terminal className="w-3.5 h-3.5 text-[#E8F876]" />
          <span>[{TELEMETRY_CODES[codeIndex]}]</span>
        </div>

        {/* 3-Second Progress Bar */}
        <div className="w-full max-w-xs mx-auto space-y-2 pt-2">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#E8F876] to-white rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(232,248,118,0.8)]"
              style={{ width: `${Math.min(100, Math.round(progress))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/40">
            <span>INITIALIZING CAMPUS ENGINE</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-md flex items-center justify-between text-[11px] text-white/40 pb-4">
        <span>MEA Engineering College · Perinthalmanna</span>
        <button
          onClick={() => {
            setIsDismissing(true);
            if (onComplete) onComplete();
          }}
          className="text-xs text-white/60 hover:text-white underline"
        >
          Skip Intro →
        </button>
      </div>
    </div>
  );
}
