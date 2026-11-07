"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import Hls from "hls.js";
import {
  Compass,
  Leaf,
  MessageSquare,
  GraduationCap,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Layers,
  Shield,
  Instagram,
  Linkedin,
  Twitter,
  CheckCircle,
} from "lucide-react";

// Reusable fadeUp animation helper with staggered delays
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

export default function MonochromeLandingPage() {
  const router = useRouter();
  const ctaVideoRef = useRef<HTMLVideoElement | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Setup HLS video streaming in CTA section with fallback
  useEffect(() => {
    const video = ctaVideoRef.current;
    if (!video) return;

    const hlsUrl =
      "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: false });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Safari HLS
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black antialiased overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. NAVBAR (Fixed, Transparent, Concentric Circles Logo, Liquid Glass)     */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 md:px-20 lg:px-28 py-4 flex items-center justify-between backdrop-blur-md bg-black/30 border-b border-white/5">
        {/* Left: Concentric Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-7 h-7 rounded-full border-2 border-white/60 flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-3 h-3 rounded-full border border-white/60 bg-white/20" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">
              MOBI
            </span>
            <span className="text-[10px] font-mono tracking-widest text-white/50 border border-white/10 px-2 py-0.5 rounded-full">
              MEA CAMPUS
            </span>
          </div>
        </Link>

        {/* Center: Nav links separated by dots */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-white/60">
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <span className="text-white/20">•</span>
          <a href="#spatial-map" className="hover:text-white transition-colors">
            3D Spatial Map
          </a>
          <span className="text-white/20">•</span>
          <a href="#eco-care" className="hover:text-white transition-colors">
            MOBI ECO
          </a>
          <span className="text-white/20">•</span>
          <a href="#philosophy" className="hover:text-white transition-colors">
            Philosophy
          </a>
          <span className="text-white/20">•</span>
          <a href="#faq-section" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right: Social Icons + Enter Hub CTA */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white transition-transform hover:scale-105"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white transition-transform hover:scale-105"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center text-white/70 hover:text-white transition-transform hover:scale-105"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>

          <Link
            href="/app"
            className="px-5 py-2 rounded-full bg-white hover:bg-slate-200 text-black text-xs font-black tracking-tight flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <span>Launch Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Full Viewport Height, MP4 Video Background, Serif Accent)*/}
      {/* ========================================================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 overflow-hidden">
        {/* Background Looping MP4 Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-45 scale-105"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
          />
          {/* Bottom Gradient Fade to Black */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          {/* Avatar Row */}
          <motion.div
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-3 liquid-glass px-4 py-1.5 rounded-full"
          >
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-neutral-800 border-2 border-black flex items-center justify-center text-[10px] font-bold">
                M
              </div>
              <div className="w-7 h-7 rounded-full bg-neutral-700 border-2 border-black flex items-center justify-center text-[10px] font-bold">
                E
              </div>
              <div className="w-7 h-7 rounded-full bg-neutral-600 border-2 border-black flex items-center justify-center text-[10px] font-bold">
                A
              </div>
            </div>
            <span className="text-xs text-white/70 font-medium">
              7,000+ students already connected across campus
            </span>
          </motion.div>

          {/* Heading with Serif Italic Accent */}
          <motion.h1
            {...fadeUp(0.2)}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white leading-[1.08]"
          >
            Managing the Campus with{" "}
            <span className="font-serif italic font-normal text-white">
              Clarity
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.3)}
            className="text-base sm:text-lg md:text-xl text-[#E6EEF5] max-w-2xl mx-auto leading-relaxed font-normal"
          >
            A student-powered digital ecosystem uniting Three.js 3D navigation, verified waste care rewards, symposium discounts, and civic peer communication.
          </motion.p>

          {/* Liquid Glass Interactive Quick Launch Form */}
          <motion.div
            {...fadeUp(0.4)}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto"
          >
            <div className="w-full sm:w-auto flex-1 liquid-glass rounded-full p-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter student department or roll..."
                defaultValue="Computer Science & Engineering"
                className="w-full bg-transparent px-4 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none"
              />
              <Link
                href="/app"
                className="bg-white hover:bg-neutral-200 text-black rounded-full px-6 py-2.5 text-xs font-black tracking-tight whitespace-nowrap shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                ENTER HUB
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "CAMPUS HAS CHANGED" SECTION                                           */}
      {/* ========================================================================= */}
      <section
        id="how-it-works"
        className="relative z-10 px-6 sm:px-12 md:px-20 lg:px-28 pt-32 md:pt-48 pb-24 max-w-7xl mx-auto"
      >
        <div className="text-center space-y-4 mb-20">
          <motion.h2
            {...fadeUp(0.1)}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white"
          >
            Campus has changed.{" "}
            <span className="font-serif italic font-normal">Have you?</span>
          </motion.h2>
          <motion.p
            {...fadeUp(0.2)}
            className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto"
          >
            Static noticeboards and congested maps are in the past. Experience an autonomous, real-time campus operating system.
          </motion.p>
        </div>

        {/* 3 Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Card 1: MOBI ECO */}
          <motion.div
            {...fadeUp(0.1)}
            className="liquid-glass rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-white/30 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Leaf className="w-8 h-8 text-lime-300" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-lime-300">
                MODULE 01 · SUSTAINABILITY
              </span>
              <h3 className="text-xl font-bold text-white">
                MOBI ECO Waste Intelligence
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Geotagged bin issue submission rewarding 15 verified Mobi Coins per report. Live tracking across 19 campus receptacles.
              </p>
            </div>
            <Link
              href="/app/eco"
              className="text-xs font-bold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              <span>Explore ECO Care</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Card 2: 3D MAP */}
          <motion.div
            id="spatial-map"
            {...fadeUp(0.2)}
            className="liquid-glass rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-white/30 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Compass className="w-8 h-8 text-teal-300" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-teal-300">
                MODULE 02 · NAVIGATION
              </span>
              <h3 className="text-xl font-bold text-white">
                3D Spatial MEA Ground Truth
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Full Three.js WebGL terrain, Dijkstra graph walking routes, building floor plans, and accessible pedestrian paths.
              </p>
            </div>
            <Link
              href="/app/map"
              className="text-xs font-bold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              <span>Launch 3D Navigation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Card 3: MOBI CONNECT */}
          <motion.div
            {...fadeUp(0.3)}
            className="liquid-glass rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-white/30 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl liquid-glass flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8 text-sky-300" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-sky-300">
                MODULE 03 · CIVIC SOCIAL
              </span>
              <h3 className="text-xl font-bold text-white">
                MOBI CONNECT Peer Dialogues
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Encrypted ephemeral chat rooms filtered by department. Protected by the Civic Courtesy Oath and daily Chat Points quota.
              </p>
            </div>
            <Link
              href="/app/connect"
              className="text-xs font-bold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              <span>Enter Community</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Tagline */}
        <p className="text-white/40 text-xs sm:text-sm text-center font-mono">
          If students don&apos;t build tomorrow&apos;s campus, someone else won&apos;t either.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* 4. MISSION SECTION (Looping Centered Video & Kinetic Typography)           */}
      {/* ========================================================================= */}
      <section
        id="philosophy"
        className="relative z-10 px-6 sm:px-12 md:px-20 lg:px-28 py-28 max-w-6xl mx-auto text-center"
      >
        {/* Large Centered Looping Video */}
        <motion.div
          {...fadeUp(0.1)}
          className="relative max-w-2xl mx-auto rounded-3xl overflow-hidden liquid-glass shadow-2xl mb-16 aspect-video"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
          />
        </motion.div>

        {/* Typography Reveal */}
        <motion.div {...fadeUp(0.2)} className="space-y-8 max-w-4xl mx-auto">
          <p className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white/90 leading-snug">
            We&apos;re building a space where{" "}
            <span className="text-white font-bold underline decoration-white/30">curiosity</span>{" "}
            meets{" "}
            <span className="text-white font-bold underline decoration-white/30">clarity</span>{" "}
            — where students find verified clean facilities, precise directions, and every contribution earns campus recognition.
          </p>

          <p className="text-lg sm:text-2xl text-white/60 leading-relaxed font-light">
            A platform where environmental hygiene, spatial intelligence, and peer respect flow together — with less friction, zero noise, and real student empowerment.
          </p>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SOLUTION SECTION (Wide Video & 4-Column Feature Grid)                  */}
      {/* ========================================================================= */}
      <section
        id="eco-care"
        className="relative z-10 px-6 sm:px-12 md:px-20 lg:px-28 py-32 border-t border-white/10 max-w-7xl mx-auto"
      >
        <div className="space-y-3 mb-12">
          <span className="text-xs font-mono tracking-[3px] uppercase text-white/50">
            SOLUTION
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white">
            The platform for{" "}
            <span className="font-serif italic font-normal">meaningful</span>{" "}
            campus life
          </h2>
        </div>

        {/* Panoramic Video Banner */}
        <motion.div
          {...fadeUp(0.1)}
          className="rounded-3xl overflow-hidden liquid-glass shadow-2xl mb-14 aspect-[21/9]"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
          />
        </motion.div>

        {/* 4-Column Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white">Smart Cleanliness Bins</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              19 GPS-mapped bins tracked in real-time. Students submit verified reports to receive 15 Mobi Coins directly.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-bold text-white">3D Campus Precision</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Three.js spatial model covering civil, mechanical, CSE blocks, hostels, auditorium, and campus shuttle stops.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-bold text-white">Civic Courtesy Oath</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Zero-tolerance moderation and daily Chat Points ensure safe, respectful anonymous peer connection across years.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-bold text-white">Dual-Ledger Wallet</h4>
            <p className="text-sm text-white/60 leading-relaxed">
              Mobi Coins are redeemable for symposium workshop fee discounts (₹1 = 1 Coin) and partnered canteen vouchers.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CTA SECTION (HLS Video Streaming with hls.js + Concentric Rings)       */}
      {/* ========================================================================= */}
      <section className="relative py-32 md:py-44 border-t border-white/10 overflow-hidden text-center">
        {/* Background HLS Video */}
        <div className="absolute inset-0 z-0">
          <video
            ref={ctaVideoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-black/60 z-[1]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 space-y-6">
          <div className="relative w-12 h-12 mx-auto rounded-full border-2 border-white/60 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border border-white/60 bg-white/30" />
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-white">
            Start Your{" "}
            <span className="font-serif italic font-normal">Campus Journey</span>
          </h2>

          <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto">
            Join thousands of MEA students actively keeping the campus clean, connected, and forward-looking.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-black tracking-tight shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              Enter Campus Hub
            </Link>

            <Link
              href="/app/map"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full liquid-glass text-white text-xs font-bold tracking-tight shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Explore 3D Map
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CAMPUS FAQ ACCORDION SECTION (Clean at the Bottom)                     */}
      {/* ========================================================================= */}
      <section
        id="faq-section"
        className="relative z-10 px-6 sm:px-12 md:px-20 lg:px-28 py-24 border-t border-white/10 max-w-5xl mx-auto"
      >
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono tracking-[3px] uppercase text-white/50">
            QUESTIONS & ANSWERS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
            Frequently Asked <span className="font-serif italic font-normal">Questions</span>
          </h2>
          <p className="text-sm text-white/60 max-w-xl mx-auto">
            Everything you need to know about MOBI&apos;s architecture, rewards, and campus deployment.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "How does the waste verification reward workflow operate?",
              a: "When a student locates an overflowing or unsegregated bin, they take a photo within MOBI ECO. Our system logs GPS coordinates, cross-references against our 19 campus receptacles, and awards 15 Mobi Coins upon verification.",
            },
            {
              q: "Can Mobi Coins be converted to cash or swapped?",
              a: "Mobi Coins are utility tokens strictly redeemable for MEA campus amenities — including technical symposium entry tickets (KAIZEN, MECHSURGE) and college canteen vouchers. They cannot be traded for external cash.",
            },
            {
              q: "How accurate is the 3D campus navigation?",
              a: "The map is built using exact ground truth coordinates from MEA Engineering College along Perinthalmanna-Nilambur Road (SH39). Every academic block, workshop, and footpath is accurately plotted with Dijkstra graph pathfinding.",
            },
            {
              q: "How does MOBI protect student privacy in peer chat?",
              a: "Chats are ephemeral and require agreeing to the Civic Courtesy Oath. No personal roll numbers or phone numbers are shared. Messages automatically expire and are purged to uphold privacy.",
            },
          ].map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="liquid-glass rounded-2xl p-5 border border-white/10 transition-colors"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/60 transition-transform ${
                      isOpen ? "transform rotate-180 text-white" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="pt-3 text-xs sm:text-sm text-white/70 leading-relaxed border-t border-white/10 mt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="relative z-10 py-12 px-6 sm:px-12 md:px-20 lg:px-28 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
        <div>
          <span>© 2026 MOBI — Evergreen Future Campus.</span>
          <span className="block sm:inline sm:ml-2 text-white/40">
            MEA Engineering College, Perinthalmanna.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/app" className="hover:text-white transition-colors">
            App Hub
          </Link>
          <Link href="/app/map" className="hover:text-white transition-colors">
            3D Map
          </Link>
          <a href="#faq-section" className="hover:text-white transition-colors">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}
