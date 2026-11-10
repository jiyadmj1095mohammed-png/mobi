"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CinematicHeroPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoOpacity, setVideoOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animFrameId: number;

    const monitorFade = () => {
      if (video.duration && !video.paused) {
        const cur = video.currentTime;
        const dur = video.duration;
        const fadeInDuration = 0.5;
        const fadeOutDuration = 0.5;

        if (cur < fadeInDuration) {
          // Fade in over 0.5s at the start (opacity 0 to 1)
          setVideoOpacity(Math.min(1, Math.max(0, cur / fadeInDuration)));
        } else if (cur > dur - fadeOutDuration) {
          // Fade out over 0.5s before the end (opacity 1 to 0)
          setVideoOpacity(Math.min(1, Math.max(0, (dur - cur) / fadeOutDuration)));
        } else {
          setVideoOpacity(1);
        }
      }
      animFrameId = requestAnimationFrame(monitorFade);
    };

    animFrameId = requestAnimationFrame(monitorFade);

    const handleEnded = () => {
      setVideoOpacity(0);
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      }, 100);
    };

    video.addEventListener("ended", handleEnded);

    // Initial play attempt
    video.play().catch(() => {});

    return () => {
      cancelAnimationFrame(animFrameId);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FFFFFF] text-[#000000] font-sans selection:bg-[#000000] selection:text-[#FFFFFF]">
      {/* Background Video Layer (z-0) */}
      <div
        className="absolute z-0 pointer-events-none overflow-hidden"
        style={{
          top: "300px",
          inset: "auto 0 0 0",
          height: "calc(100vh - 300px)",
          minHeight: "500px",
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: videoOpacity }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
        />

        {/* Gradient Overlays: absolute inset-0 bg-gradient-to-b from-white via-transparent to-white */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
      </div>

      {/* Navigation Bar (z-10) */}
      <header className="relative z-10 max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        {/* Logo: MOBI® in Instrument Serif */}
        <Link href="/" className="group flex items-baseline">
          <span
            className="text-3xl tracking-tight text-[#000000] font-serif select-none"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            MOBI<sup className="text-sm font-sans font-normal ml-0.5">®</sup>
          </span>
        </Link>

        {/* Menu Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans">
          <Link
            href="/"
            className="text-[#000000] font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            href="/app/map"
            className="text-[#6F6F6F] hover:text-[#000000] transition-colors"
          >
            3D Map
          </Link>
          <Link
            href="/app/eco"
            className="text-[#6F6F6F] hover:text-[#000000] transition-colors"
          >
            MOBI ECO
          </Link>
          <Link
            href="/app/events"
            className="text-[#6F6F6F] hover:text-[#000000] transition-colors"
          >
            Events
          </Link>
          <Link
            href="/app/connect"
            className="text-[#6F6F6F] hover:text-[#000000] transition-colors"
          >
            Connect
          </Link>
        </nav>

        {/* CTA Button */}
        <Link
          href="/app"
          className="rounded-full px-6 py-2.5 text-sm bg-[#000000] text-white hover:scale-[1.03] transition-transform font-medium select-none"
        >
          Begin Journey
        </Link>
      </header>

      {/* Hero Section (z-10) */}
      <main
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
        style={{ paddingTop: "calc(8rem - 75px)" }}
      >
        {/* Headline */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal font-serif animate-fade-rise"
          style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            lineHeight: 0.95,
            letterSpacing: "-2.46px",
            color: "#000000",
          }}
        >
          Beyond{" "}
          <span style={{ color: "#6F6F6F", fontStyle: "italic" }}>silence,</span>{" "}
          we build{" "}
          <span style={{ color: "#6F6F6F", fontStyle: "italic" }}>
            the eternal campus.
          </span>
        </h1>

        {/* Description */}
        <p
          className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed font-sans animate-fade-rise-delay"
          style={{ color: "#6F6F6F" }}
        >
          Building platforms for brilliant minds, fearless makers, and thoughtful souls. Through the noise, we craft digital havens for deep work and pure flows.
        </p>

        {/* Hero CTA Button -> Directs to Dashboard /app */}
        <Link
          href="/app"
          className="rounded-full px-14 py-5 text-base mt-12 bg-[#000000] text-[#FFFFFF] hover:scale-[1.03] transition-transform animate-fade-rise-delay-2 font-medium inline-flex items-center gap-2 shadow-sm select-none"
        >
          <span>Begin Journey</span>
          <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
        </Link>
      </main>
    </div>
  );
}
