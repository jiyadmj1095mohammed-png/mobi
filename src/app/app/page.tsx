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
  MoreVertical,
  Users2,
  GraduationCap,
  FolderKanban,
  Leaf,
  Megaphone,
  Wallet,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { profile, wallet, bins, events, announcements } = useMobiStore();
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Four key ground-truth campus bins for real-time overview
  const featuredBins = bins.slice(0, 4);

  // Top 2 upcoming campus symposiums
  const featuredEvents = events.slice(0, 2);

  // Top pinned circular
  const topNotice = announcements.find((a) => a.pinned) || announcements[0];

  return (
    <div className="space-y-6 sm:space-y-7 font-sans text-[#121417]  transition-colors">
      {/* ========================================================================= */}
      {/* 1. Header Bar: Greeting, Department & Quick Report Button                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#121417]  leading-tight flex items-center gap-2 flex-wrap">
            <span>Hello, {profile.fullName || "Student"}</span>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E8F876] text-[#121417] text-xs font-bold shadow-sm">
              ✦
            </span>
          </h1>
          <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
            <span className="text-xs sm:text-sm text-slate-500  font-medium">
              {profile.department || "MEA Engineering College"} · Campus Ecosystem
            </span>
            <span className="text-slate-300 ">•</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700  border border-emerald-500/20">
              Verified Student
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsReportOpen(true)}
            className="mobi-primary-action min-h-[44px] px-5 rounded-full bg-[#121417] hover:bg-black text-[#E8F876] text-xs font-extrabold flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Report Waste (+15 Coins)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Top Metrics Row: 3 Distinct Colorful Bento Cards                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric Card 1: Mobi Coins (Soft Emerald / Mint Theme Accent) */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="mobi-glass-card p-5 sm:p-6 rounded-[28px] bg-[#EAF5EE] border border-[#35C98A]/30 flex flex-col justify-between space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-white  flex items-center justify-center text-emerald-700  shadow-xs">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-emerald-950 ">
                Mobi Coins
              </span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600/15 text-emerald-800 ">
              +15 on Report
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-950 ">
                {wallet.mobiCoins}
              </span>
              <span className="text-xs text-emerald-800/70  font-semibold">
                / 100 Goal
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#35C98A] text-[#06251F] ml-auto">
                {Math.min(100, wallet.mobiCoins)}%
              </span>
            </div>

            {/* Segmented Indicator */}
            <div className="flex gap-1.5 mt-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 flex-1 rounded-full transition-all ${
                    i < Math.floor((wallet.mobiCoins / 100) * 8)
                      ? "bg-emerald-600 "
                      : "bg-emerald-900/10 "
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-emerald-800/80  font-medium mt-2">
              Redeemable for symposium ticket discounts
            </p>
          </div>
        </motion.div>

        {/* Metric Card 2: Chat Points (Pale Citron Theme Accent) */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="mobi-glass-card p-5 sm:p-6 rounded-[28px] bg-[#E8F876] text-[#121417] border border-[#D5E65B] flex flex-col justify-between space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-white/80  flex items-center justify-center text-[#121417]  shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#121417] ">
                Chat Points
              </span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-black/10  text-[#121417] ">
              Peer Matchmaking
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#121417] ">
                {wallet.chatPoints}
              </span>
              <span className="text-xs text-black/60  font-semibold">
                / 10 Active
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/15   ml-auto">
                {Math.min(100, wallet.chatPoints * 10)}%
              </span>
            </div>

            {/* Segmented Indicator */}
            <div className="flex gap-1.5 mt-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 flex-1 rounded-full transition-all ${
                    i < Math.floor((wallet.chatPoints / 10) * 8)
                      ? "bg-[#121417] "
                      : "bg-black/10 "
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-black/70  font-medium mt-2">
              Pass Civic Quiz to recharge chat allowance
            </p>
          </div>
        </motion.div>

        {/* Metric Card 3: Spatial Campus Promo Card (Obsidian / High Contrast) */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="mobi-glass-card p-5 sm:p-6 rounded-[28px] bg-[#121417] text-white border border-black/10 flex flex-col justify-between space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8F876]">
              SPATIAL CAMPUS
            </span>
            <div className="w-2 h-2 rounded-full bg-[#35C98A] animate-pulse" />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-snug">
              Explore 3D Campus Navigation
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Interactive WebGL terrain, building routes & 19 verified waste bins.
            </p>
          </div>

          <Link
            href="/app/map"
            className="w-full py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-[#121417] text-xs font-black tracking-tight flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <span>Launch 3D Compass</span>
            <Compass className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. Main Bento Columns: Left 8 cols + Right 4 cols (ZERO Empty Space!)      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT 8 COLUMNS: Quick Spotlights, Live Bins, Upcoming Events            */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. Quick Feature Spotlight (Two Distinct Color Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/app/eco"
              className="mobi-glass-card p-5 rounded-[28px] bg-[#F2F8F4] hover:bg-[#EAF3EC] border border-[#35C98A]/25 flex flex-col justify-between space-y-3 transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#35C98A]/20 text-emerald-800  flex items-center justify-center font-bold">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 ">
                  <span>19 Bins</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#121417] ">
                  MOBI ECO Waste Rewards
                </h4>
                <p className="text-xs text-slate-600  mt-1 leading-relaxed">
                  Earn 15 Mobi Coins per verified bin issue report across MEA Campus.
                </p>
              </div>
            </Link>

            <Link
              href="/app/events"
              className="mobi-glass-card p-5 rounded-[28px] bg-[#F9F7FC] hover:bg-[#F3EFF9] border border-[#A855F7]/25 flex flex-col justify-between space-y-3 transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#A855F7]/20 text-purple-800  flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-purple-700 ">
                  <span>4 Events</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#121417] ">
                  Campus Events & Symposia
                </h4>
                <p className="text-xs text-slate-600  mt-1 leading-relaxed">
                  Redeem Mobi Coins for up to ₹100 discount on KAIZEN & workshop tickets.
                </p>
              </div>
            </Link>
          </div>

          {/* B. Live Campus Sanitation & Waste Points Widget */}
          <div className="p-5 sm:p-6 rounded-[30px] bg-[#F8F9F6]  border border-black/5  space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-800  flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#121417] ">
                    Campus Waste Bin Directory
                  </h3>
                  <p className="text-[11px] text-slate-500 ">
                    Real-time status of MEA Engineering College GPS waste bins
                  </p>
                </div>
              </div>

              <Link
                href="/app/eco"
                className="text-xs font-bold text-emerald-700  hover:underline flex items-center gap-1"
              >
                <span>View All 19 Bins</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Bins Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {featuredBins.map((bin) => {
                const isFull = bin.condition === "full";
                const isDamaged = bin.condition === "damaged";
                return (
                  <div
                    key={bin.id}
                    className="p-3.5 rounded-2xl bg-white  border border-black/5  flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isFull
                            ? "bg-amber-100 text-amber-800  "
                            : isDamaged
                            ? "bg-red-100 text-red-800  "
                            : "bg-emerald-100 text-emerald-800  "
                        }`}
                      >
                        {isFull || isDamaged ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-[#121417]  truncate">
                          {bin.locationName}
                        </div>
                        <div className="text-[10px] text-slate-400  capitalize">
                          {bin.category} waste · {bin.lastServiced}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                        isFull
                          ? "bg-amber-100 text-amber-800  "
                          : isDamaged
                          ? "bg-red-100 text-red-800  "
                          : "bg-emerald-100 text-emerald-800  "
                      }`}
                    >
                      {bin.condition}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. Upcoming Campus Events Showcase */}
          <div className="p-5 sm:p-6 rounded-[30px] bg-[#F8F9F6]  border border-black/5  space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-800  flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#121417] ">
                    Featured Events & Symposia
                  </h3>
                  <p className="text-[11px] text-slate-500 ">
                    Apply Mobi Coins for ticket fee discounts
                  </p>
                </div>
              </div>

              <Link
                href="/app/events"
                className="text-xs font-bold text-purple-700  hover:underline flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Events List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {featuredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl bg-white  border border-black/5  flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-bold text-purple-600  tracking-wider">
                        {evt.department}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800  ">
                        -₹{evt.maxCoinDiscount} with Coins
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#121417]  mt-1 leading-snug line-clamp-1">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-slate-500  mt-0.5 line-clamp-2">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100  flex items-center justify-between text-xs">
                    <span className="text-slate-600  font-semibold text-[11px]">
                      {evt.date}
                    </span>
                    <Link
                      href="/app/events"
                      className="px-3 py-1 rounded-xl bg-[#121417] hover:bg-black text-white    text-[11px] font-bold transition-all shadow-xs"
                    >
                      Book Ticket
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT 4 COLUMNS: Colorful Counters, Quick Access & Noticeboard Alert    */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top 2 Colorful Stat Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/app/connect"
              className="p-4 sm:p-5 rounded-[26px] bg-[#F7FBE6]  border border-[#E8F876]/40  flex flex-col justify-between h-32 transition-all shadow-xs group"
            >
              <div className="w-9 h-9 rounded-2xl bg-white  flex items-center justify-center text-[#121417]  shadow-xs group-hover:scale-105 transition-transform">
                <Users2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-[#121417]  block">
                  Community
                </span>
                <span className="text-[10px] text-slate-600  font-bold">
                  120+ active online
                </span>
              </div>
            </Link>

            <Link
              href="/app/events"
              className="p-4 sm:p-5 rounded-[26px] bg-[#EDF8F2]  border border-[#35C98A]/40  flex flex-col justify-between h-32 transition-all shadow-xs group"
            >
              <div className="w-9 h-9 rounded-2xl bg-white  flex items-center justify-center text-emerald-800  shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-[#121417]  block">
                  Events
                </span>
                <span className="text-[10px] text-emerald-800  font-bold">
                  4 upcoming passes
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Access Directory with Visual Accent Themes */}
          <div className="space-y-2.5">
            <Link
              href="/app/eco"
              className="p-4 rounded-2xl bg-[#F4F9F5]  border border-[#35C98A]/20 hover:border-[#35C98A]/40 flex items-center justify-between transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-800  flex items-center justify-center">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#121417] ">
                    Facilities Directory
                  </div>
                  <div className="text-[10px] text-slate-500 ">
                    19 verified waste bins & drinking water...
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-black  transition-colors" />
            </Link>

            <Link
              href="/app/campus-connect"
              className="p-4 rounded-2xl bg-[#FDF8EE]  border border-[#F59E0B]/20 hover:border-[#F59E0B]/40 flex items-center justify-between transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-800  flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#121417] ">
                    Official Circulars
                  </div>
                  <div className="text-[10px] text-slate-500 ">
                    Bus schedules & college notices...
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-black  transition-colors" />
            </Link>

            <Link
              href="/app/wallet"
              className="p-4 rounded-2xl bg-[#EEF6FB]  border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 flex items-center justify-between transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-800  flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#121417] ">
                    Mobi Wallet Ledger
                  </div>
                  <div className="text-[10px] text-slate-500 ">
                    Check rewards & fee redemptions...
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-black  transition-colors" />
            </Link>

            <Link
              href="/app/connect"
              className="p-4 rounded-2xl bg-[#F6F1FB]  border border-[#A855F7]/20 hover:border-[#A855F7]/40 flex items-center justify-between transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-800  flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#121417] ">
                    Civic Courtesy Chat
                  </div>
                  <div className="text-[10px] text-slate-500 ">
                    Anonymous peer discussions & quizzes...
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-black  transition-colors" />
            </Link>
          </div>

          {/* Pinned Official Noticeboard Callout */}
          {topNotice && (
            <div className="p-4 sm:p-5 rounded-[26px] bg-[#121417]  text-white border border-white/10 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E8F876]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8F876]">
                    PINNED NOTICE
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {topNotice.department}
                </span>
              </div>
              <h4 className="text-xs font-extrabold leading-snug text-white">
                {topNotice.title}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                {topNotice.content}
              </p>
              <Link
                href="/app/campus-connect"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E8F876] hover:underline pt-1"
              >
                <span>Read Full Circular</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Geotagged Waste Issue Report Modal */}
      <StudentReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
