"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";

const MESSAGES = [
  "Connecting you to campus life.",
  "Preparing your sustainable campus tools.",
  "Bringing your community into focus.",
];

export default function CampusLoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    const totalDuration = 5000;
    const intervalTime = 25;
    const step = 100 / (totalDuration / intervalTime);

    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % MESSAGES.length);
    }, 850);

    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        const next = current + step;
        if (next >= 100) {
          window.clearInterval(progressTimer);
          window.clearInterval(messageTimer);
          window.setTimeout(() => {
            setIsDismissing(true);
            window.setTimeout(() => onComplete?.(), 350);
          }, 120);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      window.clearInterval(progressTimer);
      window.clearInterval(messageTimer);
    };
  }, [onComplete]);

  const skip = () => {
    setIsDismissing(true);
    window.setTimeout(() => onComplete?.(), 250);
  };

  const percentage = Math.min(100, Math.round(progress));

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black p-5 font-sans transition-opacity duration-300 sm:p-8 ${
        isDismissing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <main className="relative w-full max-w-[500px] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-9">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[100px] bg-white/[0.04]" />

        <header className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black shadow-sm">
              <Leaf className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight text-white">MOBI</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Future campus</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            MEA College
          </div>
        </header>

        <section className="relative py-12 text-center sm:py-14" aria-live="polite">
          <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/15" />
            <div className="absolute inset-3 animate-[spin_12s_linear_infinite] rounded-full border border-dashed border-white/30" />
            <span className="absolute -right-0.5 top-5 h-3 w-3 rounded-full bg-white shadow-[0_0_0_5px_rgba(255,255,255,0.12)]" />
            <span className="absolute bottom-4 left-1 h-2.5 w-2.5 rounded-full bg-white/50" />
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white/10 text-white shadow-sm">
              <Sparkles className="h-7 w-7" aria-hidden="true" />
            </div>
          </div>

          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Welcome to MOBI</p>
          <h1 className="mx-auto max-w-sm text-3xl font-extrabold tracking-tight text-white sm:text-[34px]">
            Your campus, ready when you are.
          </h1>
          <p className="mx-auto mt-4 min-h-5 max-w-xs text-sm font-medium leading-relaxed text-white/55 transition-all">
            {MESSAGES[messageIndex]}
          </p>
        </section>

        <div className="relative">
          <div className="mb-2.5 flex items-center justify-between text-[11px] font-bold">
            <span className="text-white/50">Setting things up</span>
            <span className="text-white">{percentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 p-[3px]">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-75 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <footer className="relative mt-7 flex items-center justify-between border-t border-white/10 pt-5">
          <span className="text-[11px] font-medium text-white/45">MEA Engineering College</span>
          <button
            type="button"
            onClick={skip}
            className="inline-flex items-center gap-1 text-xs font-bold text-white transition-colors hover:text-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Continue <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </footer>
      </main>
    </div>
  );
}
