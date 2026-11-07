"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

export default function OfflinePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const powerOWrapRef = useRef<HTMLSpanElement>(null);
  const powerHaloRef = useRef<HTMLSpanElement>(null);
  const flyingDotRef = useRef<HTMLDivElement>(null);

  const [isOnline, setIsOnline] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Start video on night / offline frame (4.95s)
    video.currentTime = 4.95;
    video.pause();

    // Glints simulation
    const stars: Array<{ x: number; y: number; size: number; phase: number; speed: number }> = [];
    for (let i = 0; i < 24; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.45,
        size: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 2,
      });
    }

    let animationId: number;
    const render = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const starCount = isOnline ? 10 : 22;
      for (let i = 0; i < starCount; i++) {
        const st = stars[i];
        const px = st.x * canvas.width;
        const py = st.y * canvas.height;
        const brightness = (Math.sin(now * 0.002 * st.speed + st.phase) + 1) / 2;

        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.75})`;
        ctx.beginPath();
        ctx.arc(px, py, st.size * (0.6 + brightness * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };
    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [isOnline]);

  const handlePowerClick = () => {
    const video = videoRef.current;
    if (!video || isSwitching) return;

    setIsSwitching(true);

    if (isOnline) {
      // Go Offline
      setIsOnline(false);
      video.currentTime = 2.3;
      video.play().catch(() => {});

      let dotTriggered = false;
      const checkFrame = () => {
        if (video.currentTime >= 4.72 && !dotTriggered) {
          dotTriggered = true;
          triggerFlyingDot();
        }
        if (video.currentTime >= 4.95) {
          video.pause();
          video.currentTime = 4.95;
          setIsSwitching(false);
        } else {
          requestAnimationFrame(checkFrame);
        }
      };
      requestAnimationFrame(checkFrame);
    } else {
      // Go Online
      setIsOnline(true);
      video.currentTime = 0.6;
      video.play().catch(() => {});

      const checkOnline = () => {
        if (video.currentTime >= 2.3) {
          video.pause();
          video.currentTime = 2.3;
          setIsSwitching(false);
        } else {
          requestAnimationFrame(checkOnline);
        }
      };
      requestAnimationFrame(checkOnline);
    }
  };

  const triggerFlyingDot = () => {
    const dot = flyingDotRef.current;
    const powerO = powerOWrapRef.current;
    const halo = powerHaloRef.current;
    if (!dot || !powerO) return;

    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const vw = 1920;
    const vh = 1080;
    const scale = Math.max(cw / vw, ch / vh);
    const nw = vw * scale;
    const nh = vh * scale;
    const ox = (cw - nw) / 2;
    const oy = ch - nh;

    const startX = ox + 945 * scale;
    const startY = oy + 594 * scale;

    const rect = powerO.getBoundingClientRect();
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;

    dot.style.display = "block";
    const startTime = performance.now();
    const duration = 780;

    const controlX = Math.min(startX, endX) - 60;
    const controlY = Math.min(startY, endY) - 40;

    const step = (now: number) => {
      const p = Math.min(1, (now - startTime) / duration);
      const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const x = (1 - ease) * (1 - ease) * startX + 2 * (1 - ease) * ease * controlX + ease * ease * endX;
      const y = (1 - ease) * (1 - ease) * startY + 2 * (1 - ease) * ease * controlY + ease * ease * endY;

      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`;

      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        dot.style.display = "none";
        if (halo) {
          halo.style.opacity = "1";
          setTimeout(() => {
            halo.style.opacity = "0";
          }, 900);
        }
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <div className="relative w-screen h-[100svh] overflow-hidden bg-[#0d1217] text-white flex flex-col justify-between font-sans">
      {/* Top Wash */}
      <div className="absolute top-0 left-0 w-full h-[38%] bg-gradient-to-b from-[#0a0f14]/80 via-[#0a0f14]/40 to-transparent z-10 pointer-events-none" />

      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover object-bottom block"
          playsInline
          muted
          preload="auto"
          poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/af6deff1-d678-4dc6-ae24-2880b16cdb20.jpg"
        >
          <source
            media="(max-width: 900px)"
            src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/15017aa7-135b-471f-a8a1-42a208bc61b2.mp4"
            type="video/mp4"
          />
          <source
            src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/abdab52e-bb1b-477d-ae7c-26c5f8915433.mp4"
            type="video/mp4"
          />
        </video>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      </div>

      {/* Flying Orb */}
      <div
        ref={flyingDotRef}
        className="fixed w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_16px_8px_rgba(255,255,255,0.95),0_0_32px_14px_rgba(229,248,118,0.6)] pointer-events-none z-50 hidden"
      />

      {/* Top Navigation & Status */}
      <div className="relative z-20 p-6 flex items-center justify-between">
        <Link
          href="/app"
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-bold text-white flex items-center gap-2 transition-all border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Campus Dashboard</span>
        </Link>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-xs font-semibold">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isOnline ? "bg-[#e5f876] shadow-[0_0_8px_#e5f876]" : "bg-red-400 shadow-[0_0_8px_#f87171]"
            }`}
          />
          <span className={isOnline ? "text-[#e5f876]" : "text-red-300"}>
            {isOnline ? "Campus Link Restored" : "Offline Mode Active"}
          </span>
        </div>
      </div>

      {/* Footer Content Grid */}
      <div className="relative z-20 p-6 sm:p-10 lg:p-14 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl">
        {/* Brand Column */}
        <div className="space-y-4">
          <button
            onClick={handlePowerClick}
            className="group inline-flex items-center text-4xl sm:text-5xl font-serif text-white outline-none cursor-pointer"
            title="Click to power on/off"
          >
            <span>m</span>
            <span
              ref={powerOWrapRef}
              className="relative inline-flex items-center justify-center w-9 sm:w-12 h-12 sm:h-14 mx-0.5 transition-transform group-active:scale-95 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            >
              <span
                ref={powerHaloRef}
                className="absolute inset-[-20%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(229,248,118,0.4)_40%,transparent_70%)] opacity-0 blur-md pointer-events-none transition-opacity duration-700"
              />
              <svg className="w-full h-full" viewBox="0 0 50 62">
                <path
                  d="M14.2 22.6 A19 19 0 1 0 35.8 22.6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4.6"
                  strokeLinecap="round"
                />
                <path
                  d="M25 6.5 V33"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span>bi</span>
          </button>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xs leading-relaxed">
            {isOnline
              ? "Connected to MEA Engineering College local network. Tap power to disconnect."
              : "Everything you need when the campus network disconnects. Tap the power button to reconnect."}
          </p>

          <div className="text-[11px] text-slate-500">
            © 2026 MOBI · MEA Engineering College. All rights reserved.
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3">
          <h4 className="text-xl font-serif text-white">Navigation</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li><Link href="/app/map" className="hover:text-white transition-colors">3D Campus Map</Link></li>
            <li><Link href="/app/map" className="hover:text-white transition-colors">Academic Blocks</Link></li>
            <li><Link href="/app/eco" className="hover:text-white transition-colors">19 Waste Bins</Link></li>
            <li><Link href="/app/eco" className="hover:text-white transition-colors">Water Points</Link></li>
          </ul>
        </div>

        {/* Ecosystem Links */}
        <div className="space-y-3">
          <h4 className="text-xl font-serif text-white">Ecosystem</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li><Link href="/app/eco" className="hover:text-white transition-colors">MOBI ECO Care</Link></li>
            <li><Link href="/app/events" className="hover:text-white transition-colors">Campus Events</Link></li>
            <li><Link href="/app/wallet" className="hover:text-white transition-colors">Wallet & Ledger</Link></li>
            <li><Link href="/app/connect" className="hover:text-white transition-colors">Civic Peer Chat</Link></li>
          </ul>
        </div>

        {/* Reconnect / Support Links */}
        <div className="space-y-3">
          <h4 className="text-xl font-serif text-white">Support</h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li><Link href="/app/campus-connect" className="hover:text-white transition-colors">Campus Bulletins</Link></li>
            <li>
              <button
                onClick={() => window.location.reload()}
                className="hover:text-white transition-colors text-left flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3 text-[#e5f876]" />
                <span>Retry Connection</span>
              </button>
            </li>
            <li><Link href="/app" className="hover:text-white transition-colors">Campus Dashboard</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
