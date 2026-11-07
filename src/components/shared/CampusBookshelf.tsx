"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers,
  MessageSquare,
  Compass,
  Leaf,
  GraduationCap,
  Wallet,
  Newspaper,
  HelpCircle,
  X,
} from "lucide-react";

export interface CampusBookItem {
  id: string;
  vol: string;
  title: string;
  japanese: string;
  category: "Campus Life" | "Sustainability" | "Guides & Ledger";
  route: string;
  themeColor: string;
  spineColor: string;
  accentBg: string;
  synopsis: string;
  features: string[];
  metrics: string;
  icon: React.ElementType;
}

const BOOKS: CampusBookItem[] = [
  {
    id: "connect",
    vol: "VOL. 01",
    title: "Community Chat",
    japanese: "SHINBOKU / 親睦",
    category: "Campus Life",
    route: "/app/connect",
    themeColor: "#E8F876",
    spineColor: "#181A1D",
    accentBg: "from-amber-400 to-lime-300",
    synopsis:
      "A student-first civic communication network. Pair anonymously with campus peers, complete the civic courtesy oath, and exchange department perspectives without social friction.",
    features: [
      "Department-filtered anonymous rooms",
      "Civic Courtesy Oath verification",
      "Daily active Chat Points balance",
      "Strict zero-tolerance toxicity guard",
    ],
    metrics: "120+ active chats today · 10 Chat Points daily quota",
    icon: MessageSquare,
  },
  {
    id: "map",
    vol: "VOL. 02",
    title: "3D Campus Map",
    japanese: "CHIDOU / 智導",
    category: "Campus Life",
    route: "/app/map",
    themeColor: "#8EE0C6",
    spineColor: "#121A16",
    accentBg: "from-teal-400 to-emerald-300",
    synopsis:
      "High-precision Three.js spatial model of MEA Engineering College. Pinpointing all academic blocks, civil department, mechanical workshops, auditoriums, and 19 smart waste bins.",
    features: [
      "Interactive 3D camera pan, tilt & zoom",
      "Exact ground truth pathways & entrances",
      "Real-time waste bin status overlays",
      "One-click walking route calculator",
    ],
    metrics: "19 verified facilities · WebGL 60FPS terrain",
    icon: Compass,
  },
  {
    id: "eco",
    vol: "VOL. 03",
    title: "MOBI ECO Care",
    japanese: "KANKYOU / 環境",
    category: "Sustainability",
    route: "/app/eco",
    themeColor: "#A3E635",
    spineColor: "#162016",
    accentBg: "from-emerald-500 to-lime-400",
    synopsis:
      "Campus cleanliness governance engine. Report overflowing bins, participate in daily segregation challenges, and earn verified Mobi Coins to spend on college amenities.",
    features: [
      "GPS geotagged bin issue submission",
      "15 Mobi Coins reward per verified report",
      "Interactive 4-stream waste segregation quiz",
      "Live bin fill-level status directory",
    ],
    metrics: "15 Coins per report · 19 campus bins tracked",
    icon: Leaf,
  },
  {
    id: "events",
    vol: "VOL. 04",
    title: "Campus Symposiums",
    japanese: "SAITEN / 祭典",
    category: "Campus Life",
    route: "/app/events",
    themeColor: "#F472B6",
    spineColor: "#20141D",
    accentBg: "from-fuchsia-500 to-rose-400",
    synopsis:
      "Official campus symposium and technical festival gateway. Register for workshops, project expos, and hackathons with seamless Mobi Coin discounts.",
    features: [
      "MEA tech fests & national workshops",
      "Mobi Coin redemption (1 Coin = ₹1 discount)",
      "Digital seat reservation & ticket pass",
      "Team registration & certificate delivery",
    ],
    metrics: "4 live symposiums · Up to 50% discount with coins",
    icon: GraduationCap,
  },
  {
    id: "wallet",
    vol: "VOL. 05",
    title: "Mobi Wallet Ledger",
    japanese: "SAIFU / 財布",
    category: "Guides & Ledger",
    route: "/app/wallet",
    themeColor: "#FBBF24",
    spineColor: "#201B12",
    accentBg: "from-amber-400 to-orange-400",
    synopsis:
      "Decentralized student reward ledger. Strictly separates non-monetary Chat Points from real value Mobi Coins earned exclusively through campus environmental care.",
    features: [
      "Segregated Mobi Coins vs Chat Points",
      "Transparent campus transaction ledger",
      "College cafeteria voucher redemptions",
      "Symposium discount coupon generation",
    ],
    metrics: "Zero exchange friction · Campus partner verified",
    icon: Wallet,
  },
  {
    id: "notices",
    vol: "VOL. 06",
    title: "Official Circulars",
    japanese: "KOUHOU / 広報",
    category: "Guides & Ledger",
    route: "/app/campus-connect",
    themeColor: "#60A5FA",
    spineColor: "#121A24",
    accentBg: "from-blue-500 to-sky-300",
    synopsis:
      "Direct communication channel between campus administration and students. Track Perinthalmanna bus routes, semester exam schedules, and department bulletins.",
    features: [
      "Official college administration circulars",
      "Daily Perinthalmanna bus departure timings",
      "Departmental announcements & club feeds",
      "Priority urgent alerts on exam dates",
    ],
    metrics: "Updated daily · MEA official communications",
    icon: Newspaper,
  },
  {
    id: "faq",
    vol: "VOL. 07",
    title: "Campus Guide & FAQ",
    japanese: "TEBIKI / 手引",
    category: "Guides & Ledger",
    route: "/app/eco",
    themeColor: "#E2E8F0",
    spineColor: "#1A1D20",
    accentBg: "from-slate-400 to-zinc-300",
    synopsis:
      "The definitive manual for campus life. Everything freshmen and returning students need to know about campus protocols, waste segregation rules, and library hours.",
    features: [
      "Step-by-step campus protocols",
      "Color-coded waste disposal rules",
      "Campus helpline & emergency directory",
      "Student union contribution guides",
    ],
    metrics: "Comprehensive handbook · Free student access",
    icon: HelpCircle,
  },
];

export default function CampusBookshelf() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const activeBook = BOOKS[activeIndex] || BOOKS[0];

  // Filter books based on category tab
  const filteredIndices = BOOKS.map((b, i) => ({ b, i })).filter(({ b }) =>
    selectedCategory === "All" ? true : b.category === selectedCategory
  );

  // Keyboard navigation (ArrowLeft / ArrowRight / Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDetailOpen) {
        if (e.key === "Escape") setIsDetailOpen(false);
        return;
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : BOOKS.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev < BOOKS.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Enter") {
        setIsDetailOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDetailOpen]);

  // Smooth mouse parallax tilt on active book
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -yRatio * 14, // tilt up/down
      y: xRatio * 18, // tilt left/right
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-[36px] bg-[#121417] text-white p-5 sm:p-7 md:p-8 overflow-hidden shadow-2xl border border-white/10 select-none"
    >
      {/* Background Subtle Gradient & Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(232,248,118,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Header & Category Filter Controls */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E8F876]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Campus Library Shelf Hero</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 text-white">
            MOBI Feature Bookshelf
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Click any book spine to pull it forward in 3D. Open to reveal detailed module specs.
          </p>
        </div>

        {/* Category Pills & Nav Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {["All", "Campus Life", "Sustainability", "Guides & Ledger"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                const first = BOOKS.findIndex(
                  (b) => cat === "All" || b.category === cat
                );
                if (first !== -1) setActiveIndex(first);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#E8F876] text-[#121417] shadow-sm font-bold"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : BOOKS.length - 1))
              }
              aria-label="Previous Book"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev < BOOKS.length - 1 ? prev + 1 : 0))
              }
              aria-label="Next Book"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Perspective Bookshelf Stage */}
      <div
        className="relative my-8 sm:my-10 h-72 sm:h-80 md:h-88 flex items-center justify-center"
        style={{ perspective: "1800px" }}
      >
        {/* The Bookshelf Container Track */}
        <div
          className="relative flex items-end justify-center h-full transition-transform duration-500 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `translateX(${(3 - activeIndex) * 55}px)`,
          }}
        >
          {BOOKS.map((book, index) => {
            const isActive = index === activeIndex;
            const Icon = book.icon;
            const distFromActive = index - activeIndex;

            return (
              <div
                key={book.id}
                onClick={() => {
                  if (isActive) {
                    setIsDetailOpen(true);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                className={`relative cursor-pointer transition-all duration-500 ease-out flex-shrink-0 ${
                  isActive ? "z-30" : "z-10 hover:z-20"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  width: isActive ? "200px" : "48px",
                  height: "270px",
                  margin: isActive ? "0 22px" : "0 4px",
                  transform: isActive
                    ? `translateZ(65px) translateY(-14px) rotateX(${tilt.x}deg) rotateY(${
                        tilt.y - 4
                      }deg) rotateZ(-2.5deg)`
                    : `rotateY(-80deg) translateZ(0px) scale(0.96)`,
                }}
              >
                {/* 1. FRONT COVER (Visible when book is pulled forward) */}
                <div
                  className={`absolute inset-0 rounded-r-xl rounded-l-sm overflow-hidden flex flex-col justify-between p-4 transition-opacity duration-300 ${
                    isActive ? "opacity-100 shadow-2xl" : "opacity-0 pointer-events-none"
                  }`}
                  style={{
                    backgroundColor: book.spineColor,
                    boxShadow:
                      "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 24px rgba(232, 248, 118, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                >
                  {/* Spine Crease / Book Hinge Shadow */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

                  {/* Top Cover Section */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold tracking-widest text-[#E8F876] uppercase">
                        {book.vol}
                      </span>
                      <p className="text-[9px] text-white/50 tracking-wider">
                        {book.japanese}
                      </p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[#121417] font-bold shadow-md"
                      style={{ backgroundColor: book.themeColor }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Center Cover Graphic / Architectural Motif */}
                  <div className="relative z-10 my-auto py-2">
                    <div
                      className={`w-full h-24 rounded-lg bg-gradient-to-br ${book.accentBg} p-3 flex flex-col justify-between text-[#121417] shadow-inner relative overflow-hidden`}
                    >
                      <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-20 pointer-events-none">
                        <Icon className="w-24 h-24" />
                      </div>
                      <div className="text-[10px] font-extrabold tracking-wide uppercase">
                        MOBI MEA CAMPUS
                      </div>
                      <div className="text-base font-black leading-tight line-clamp-2">
                        {book.title}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-bold tracking-wider">
                        <span>TAP TO OPEN BOOK</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Cover Footer */}
                  <div className="relative z-10 flex items-center justify-between text-[9px] text-white/60 border-t border-white/10 pt-2">
                    <span className="font-semibold">{book.category}</span>
                    <span className="font-mono text-[8px] tracking-widest text-[#E8F876]">
                      MEA-2026-ED
                    </span>
                  </div>
                </div>

                {/* 2. BOOK SPINE (Visible when lined up on shelf) */}
                <div
                  className={`absolute inset-0 rounded-sm overflow-hidden flex flex-col justify-between items-center py-4 px-1.5 transition-all duration-300 border-l border-t border-b border-white/15 ${
                    isActive
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100 hover:brightness-125"
                  }`}
                  style={{
                    backgroundColor: book.spineColor,
                    boxShadow: "inset 2px 0 6px rgba(255,255,255,0.1), inset -2px 0 6px rgba(0,0,0,0.6)",
                  }}
                >
                  {/* Top Spine Volume Tag */}
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: book.themeColor }}
                    />
                    <span className="text-[8px] font-black tracking-tighter text-[#E8F876]">
                      {book.vol.replace("VOL. ", "V")}
                    </span>
                  </div>

                  {/* Vertical Spine Title (rotated text) */}
                  <div className="my-auto transform -rotate-90 whitespace-nowrap text-[11px] font-extrabold tracking-wider text-white/90">
                    {book.title.toUpperCase()}
                  </div>

                  {/* Bottom Spine Campus Emblem */}
                  <div className="text-[7px] font-bold tracking-widest text-white/40">
                    MOBI
                  </div>
                </div>

                {/* 3. 3D BOOK PAGES (Edge Depth on the right and top) */}
                {isActive && (
                  <>
                    {/* Right Paper Edge */}
                    <div
                      className="absolute top-1 bottom-1 right-0 w-8 origin-left bg-[#EDE8DC] border-r border-t border-b border-black/20"
                      style={{
                        transform: "rotateY(90deg) translateZ(192px)",
                        backgroundImage:
                          "repeating-linear-gradient(to right, #EDE8DC, #EDE8DC 2px, #DFD8C8 2px, #DFD8C8 3px)",
                      }}
                    />
                    {/* Top Paper Edge */}
                    <div
                      className="absolute top-0 left-1 right-1 h-8 origin-top bg-[#EDE8DC] border-t border-black/20"
                      style={{
                        transform: "rotateX(90deg) translateZ(0px)",
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, #EDE8DC, #EDE8DC 2px, #DFD8C8 2px, #DFD8C8 3px)",
                      }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* 3D Realistic Shelf Plank (The wooden / obsidian shelf ledge) */}
        <div
          className="absolute bottom-2 left-0 right-0 h-4 bg-[#1E2228] border-t border-white/20 shadow-2xl rounded-sm"
          style={{
            transform: "translateZ(10px)",
            boxShadow:
              "0 20px 35px -5px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          {/* Ledge Bevel Highlight */}
          <div className="w-full h-1 bg-white/20" />
        </div>
      </div>

      {/* Dynamic Masked Caption & Action Drawer */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Book Meta Info with Mask Slide */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/10 text-[#E8F876]">
              {activeBook.vol}
            </span>
            <span className="text-xs text-white/50 font-medium">
              {activeBook.japanese} · {activeBook.category}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>{activeBook.title}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
              {activeBook.metrics}
            </span>
          </h3>

          <p className="text-xs text-white/70 max-w-xl line-clamp-1">
            {activeBook.synopsis}
          </p>
        </div>

        {/* Right: Dual CTA Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <button
            onClick={() => setIsDetailOpen(true)}
            className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border border-white/15"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8F876]" />
            <span>Read Summary</span>
          </button>

          <Link
            href={activeBook.route}
            className="px-5 py-2.5 rounded-full bg-[#E8F876] hover:bg-[#d8e866] text-[#121417] text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <span>Open {activeBook.title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXPANDABLE PAPER SHEET / DETAIL MODAL (The Leon Vasari Paper Reveal)      */}
      {/* ========================================================================= */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="relative w-full max-w-2xl rounded-[32px] bg-[#FAF8F5] text-[#121417] p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden border border-black/10 animate-in zoom-in-95 duration-300"
            style={{
              backgroundImage:
                "radial-gradient(circle at 100% 0%, rgba(232,248,118,0.2), transparent 50%), radial-gradient(circle at 0% 100%, rgba(186,196,184,0.3), transparent 60%)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsDetailOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Book Volume Header */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span className="px-2.5 py-1 rounded-full bg-[#121417] text-white">
                {activeBook.vol}
              </span>
              <span>{activeBook.japanese}</span>
              <span>·</span>
              <span className="text-[#121417] font-extrabold">{activeBook.category}</span>
            </div>

            {/* Book Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#121417] mt-3">
              {activeBook.title}
            </h2>

            {/* Synopsis */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed mt-3">
              {activeBook.synopsis}
            </p>

            {/* Key Features Bullet Cards */}
            <div className="mt-6 space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Core Capabilities & Architecture
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeBook.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white border border-black/5 flex items-start gap-2.5 shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#E8F876] text-[#121417] flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-xs font-semibold text-slate-800 leading-snug">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Metrics Badge */}
            <div className="mt-5 p-3.5 rounded-2xl bg-[#121417] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8F876] animate-pulse" />
                <span className="font-semibold text-white/80">Active Campus Signal:</span>
                <span className="font-bold text-[#E8F876]">{activeBook.metrics}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-5 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-bold text-slate-600 hover:text-black hover:bg-black/5 transition-colors"
              >
                Close Shelf Detail
              </button>

              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  router.push(activeBook.route);
                }}
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#121417] hover:bg-black text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <span>Navigate to {activeBook.title}</span>
                <ExternalLink className="w-4 h-4 text-[#E8F876]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
