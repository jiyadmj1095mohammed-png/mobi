"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMobiStore } from "@/lib/state";
import StudentReportModal from "@/features/eco/StudentReportModal";
import {
  Plus,
  Coins,
  MessageSquare,
  Compass,
  ArrowUpRight,
  Leaf,
  Megaphone,
  Wallet,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { profile, wallet, bins, events, announcements } = useMobiStore();
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Four key campus bins for overview
  const featuredBins = bins.slice(0, 4);

  // Top 2 upcoming campus symposiums
  const featuredEvents = events.slice(0, 2);

  // Top notice
  const topNotice = announcements.find((a) => a.pinned) || announcements[0];

  return (
    <div className="space-y-6 sm:space-y-7 font-sans text-[#181514]">
      {/* ========================================================================= */}
      {/* 1. Header Bar: Greeting, Department & Tactile Quick Actions               */}
      {/* ========================================================================= */}
      <div className="bg-[#FAF3E0] border-[2.5px] border-black rounded-2xl p-4 sm:p-6 shadow-[5px_5px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#1D838F] text-white border border-black shadow-[1.5px_1.5px_0px_#000]">
              MOBI DASHBOARD
            </span>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#EEA827] text-black border border-black shadow-[1.5px_1.5px_0px_#000]">
              ✦ MEA CAMPUS
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black flex items-center gap-2 flex-wrap">
            <span>Hello, {profile.fullName || "Student"}</span>
            <span className="inline-block bg-[#D84F2A] text-white text-xs px-2 py-0.5 rounded-md border-2 border-black -rotate-2 shadow-[2px_2px_0px_#000]">
              VERIFIED
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-bold text-stone-600 mt-1">
            {profile.department || "Engineering"} • One Campus. One Community. A Better Tomorrow.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsReportOpen(true)}
            className="brutal-btn bg-[#D84F2A] hover:bg-[#c9431f] text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Report Waste (+15 Coins)</span>
          </button>

          <Link
            href="/app/map"
            className="brutal-btn bg-[#EEA827] hover:bg-[#e09a1c] text-black text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>3D Map</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Bento Grid: Metrics & Key Modules in Neo-Brutalist Pop Style           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Mobi Wallet (Warm Mustard Gold) */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.15 }}
          className="bg-[#FAF3E0] border-[2.5px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#EEA827] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-sm font-black uppercase tracking-tight text-black">
                Mobi Wallet
              </span>
            </div>
            <Link
              href="/app/wallet"
              className="text-xs font-black text-[#D84F2A] hover:underline flex items-center gap-1"
            >
              Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Coins */}
            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-black uppercase text-stone-500 block">
                Mobi Coins
              </span>
              <div className="text-2xl font-black text-black mt-1">
                {wallet.mobiCoins}
              </div>
              <span className="text-[9px] font-bold text-[#1D838F] block mt-0.5">
                Redeem for passes
              </span>
            </div>

            {/* Chat Points */}
            <div className="bg-[#EEA827] border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_#000]">
              <span className="text-[10px] font-black uppercase text-black/70 block">
                Chat Points
              </span>
              <div className="text-2xl font-black text-black mt-1">
                {wallet.chatPoints}
              </div>
              <span className="text-[9px] font-bold text-black/80 block mt-0.5">
                Active civic balance
              </span>
            </div>
          </div>

          <Link
            href="/app/wallet"
            className="brutal-btn w-full bg-[#24201E] text-white text-xs font-black py-2 rounded-xl text-center block"
          >
            Redeem at Event Counters
          </Link>
        </motion.div>

        {/* Card 2: 3D Spatial Campus Navigation (Dark Retro Card) */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.15 }}
          className="bg-[#24201E] text-white border-[2.5px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 retro-halftone-white opacity-10 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="bg-[#1D838F] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
                WebGL 3D
              </span>
              <span className="text-[10px] font-black text-[#EEA827] tracking-wider uppercase">
                19 Verified Markers
              </span>
            </div>

            <h3 className="text-lg font-black text-white leading-tight">
              3D Spatial Campus Navigation
            </h3>
            <p className="text-xs font-medium text-stone-300 mt-1.5 leading-relaxed">
              Interactive terrain model with shortest walking path routing between departments, gates & facilities.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/app/map"
              className="brutal-btn w-full bg-[#EEA827] text-black text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Launch 3D Orbit Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Card 3: Noticeboard / Top Circular (Rust Terracotta Card) */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.15 }}
          className="bg-[#D84F2A] text-white border-[2.5px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white text-[#D84F2A] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
                <Megaphone className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider">
                Official Notice
              </span>
            </div>
            <span className="bg-black/30 border border-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Pinned
            </span>
          </div>

          <div className="bg-white/10 border-2 border-black/20 rounded-xl p-3">
            <h4 className="text-sm font-black text-white line-clamp-1">
              {topNotice?.title || "MEA Annual Tech Fest Announced"}
            </h4>
            <p className="text-xs font-medium text-white/85 mt-1 line-clamp-2">
              {topNotice?.content || "Registration for college symposiums and workshops is now open through MOBI."}
            </p>
          </div>

          <Link
            href="/app/campus-connect"
            className="brutal-btn w-full bg-white text-black text-xs font-black py-2 rounded-xl text-center block"
          >
            View All Circulars
          </Link>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. Middle Section: MOBI ECO Live Bins & Upcoming Events                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Section A: Live Bin Directory Status (Petrol Teal Theme) */}
        <div className="bg-[#FAF3E0] border-[2.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_#000] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1D838F] text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                <Leaf className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="text-base font-black text-black leading-tight">
                  MOBI ECO · Campus Waste Status
                </h3>
                <span className="text-[10px] font-bold text-stone-500">
                  Real-time segregated bin monitoring
                </span>
              </div>
            </div>

            <Link
              href="/app/eco"
              className="text-xs font-black text-[#1D838F] hover:underline flex items-center gap-1"
            >
              Full Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bins List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredBins.map((bin) => {
              const isGood = bin.condition === "good";
              const isFull = bin.condition === "full";

              return (
                <div
                  key={bin.id}
                  className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_#000] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-black">
                      {bin.id}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border border-black ${
                        isGood
                          ? "bg-[#879C74] text-white"
                          : isFull
                          ? "bg-[#D84F2A] text-white"
                          : "bg-[#EEA827] text-black"
                      }`}
                    >
                      {bin.condition}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-stone-700 truncate">
                    {bin.locationName}
                  </p>
                  <span className="text-[10px] font-bold text-stone-500 mt-1 uppercase">
                    {bin.category}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/app/eco"
              className="brutal-btn bg-[#1D838F] hover:bg-[#166e79] text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5"
            >
              <span>Play Sorting Quiz (+5 Coins)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setIsReportOpen(true)}
              className="text-xs font-black text-[#D84F2A] hover:underline"
            >
              + Submit Issue Report
            </button>
          </div>
        </div>

        {/* Section B: Upcoming Campus Events Showcase */}
        <div className="bg-[#FAF3E0] border-[2.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_#000] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EEA827] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-black leading-tight">
                  Upcoming Campus Events
                </h3>
                <span className="text-[10px] font-bold text-stone-500">
                  Symposium passes & workshop discounts
                </span>
              </div>
            </div>

            <Link
              href="/app/events"
              className="text-xs font-black text-[#EEA827] hover:underline flex items-center gap-1"
            >
              All Events <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Event Cards */}
          <div className="space-y-3">
            {featuredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white border-2 border-black rounded-xl p-3.5 shadow-[2px_2px_0px_#000] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-black">
                      {evt.title}
                    </span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#FAF3E0] border border-black">
                      {evt.department}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-stone-500 mt-0.5">
                    {evt.date} • {evt.venue}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-black block">
                    ₹{evt.fee}
                  </span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#EEA827] text-black border border-black inline-block mt-0.5">
                    Save ₹{evt.maxCoinDiscount} w/ Coins
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/app/events"
              className="brutal-btn w-full bg-[#FAF3E0] hover:bg-[#f2e7cb] text-black text-xs font-black py-2.5 rounded-xl text-center block"
            >
              Browse All College Symposiums & Workshops
            </Link>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <StudentReportModal onClose={() => setIsReportOpen(false)} />
      )}
    </div>
  );
}
