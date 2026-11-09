"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMobiStore } from "@/lib/state";
import StudentReportModal from "@/features/eco/StudentReportModal";
import {
  Settings,
  Plus,
  Coins,
  MessageSquare,
  Compass,
  ArrowUpRight,
  MoreVertical,
    Users2,
  GraduationCap,
  HelpCircle,
  FolderKanban,
  Newspaper,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  Navigation,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { profile, wallet } = useMobiStore();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const FAQS = [
    {
      q: "How do I earn Mobi Coins through campus cleanliness?",
      a: "When you notice an overflowing or damaged waste bin across MEA Engineering College, click 'Report Waste Issue' or visit MOBI ECO. Snap a geotagged photo. Once verified, 15 Mobi Coins are credited directly to your wallet.",
    },
    {
      q: "What is the difference between Mobi Coins and Chat Points?",
      a: "Mobi Coins carry real economic value on campus (redeemable for symposium registration discounts and campus canteen perks). Chat Points are a non-monetary daily quota (10 points) allocated to encourage respectful, spam-free peer discussions.",
    },
    {
      q: "How do I navigate between departments using the 3D Campus Map?",
      a: "Open the Campus Map, select your starting point (such as the Main Campus Entrance or Bus Stop) and your destination building. The Three.js engine will render the exact walking path with distance in meters and walking duration.",
    },
    {
      q: "Is student chat anonymous and safe?",
      a: "Yes. All random peer encounters require accepting the Civic Courtesy Oath. No personal roll numbers or phone numbers are shared. Real-time safety filters ensure a productive, harassment-free student dialogue.",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-7 font-sans text-[#121417]">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#121417] leading-tight flex items-center gap-2 flex-wrap">
            <span>Hello, {profile.fullName || "Student"}</span>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E8F876] text-xs font-bold shadow-sm">
              ✦
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {profile.department || "MEA Engineering College"} · Campus Ecosystem
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsReportOpen(true)}
            className="min-h-[42px] px-5 rounded-full bg-[#121417] hover:bg-black text-white text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Report Waste Issue</span>
          </button>
        </div>
      </div>



      {/* 3. Top Metrics Row (3 Distinct Bento Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric Card 1: Mobi Coins (Operations Style) */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="p-5 rounded-[28px] bg-[#F8F9F6] border border-black/5 flex flex-col justify-between space-y-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-700 shadow-sm">
                <Coins className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Mobi Coins</span>
            </div>
            <button className="text-slate-400 hover:text-slate-700">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#121417]">
                {wallet.mobiCoins}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 100 Goal</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F876] text-[#121417] ml-auto">
                {Math.min(100, wallet.mobiCoins)}%
              </span>
            </div>

            {/* Segmented Indicator */}
            <div className="flex gap-1 mt-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-5 flex-1 rounded-full ${
                    i < Math.floor((wallet.mobiCoins / 100) * 8)
                      ? "bg-[#121417]"
                      : "border-2 border-dashed border-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Metric Card 2: Chat Points (Pale Citron Style) */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="p-5 rounded-[28px] bg-[#E8F876] text-[#121417] flex flex-col justify-between space-y-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-[#121417] shadow-sm">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#121417]">Chat Points</span>
            </div>
            <button className="text-black/50 hover:text-black">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#121417]">
                {wallet.chatPoints}
              </span>
              <span className="text-xs text-black/60 font-semibold">/ 10 Active</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-[#121417] ml-auto">
                {Math.min(100, wallet.chatPoints * 10)}%
              </span>
            </div>

            {/* Segmented Indicator */}
            <div className="flex gap-1 mt-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-5 flex-1 rounded-full ${
                    i < Math.floor((wallet.chatPoints / 10) * 8)
                      ? "bg-[#121417]"
                      : "border-2 border-dashed border-black/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Metric Card 3: Spatial Campus Promo Card */}
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.2 }}
          className="p-5 rounded-[28px] bg-[#121417] text-white flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden"
        >
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#E8F876]">
              Spatial Campus
            </div>
            <h3 className="text-sm sm:text-base font-extrabold leading-snug">
              Explore 3D Campus Navigation
            </h3>
            <p className="text-[11px] text-white/60">
              Interactive WebGL terrain & 19 verified waste bins.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/app/map"
              className="w-full min-h-[38px] px-4 rounded-full bg-white hover:bg-slate-100 text-[#121417] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <span>Launch 3D</span>
              <Compass className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 4. Bento Grid: Engagement Activity & Right Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Feature Spotlight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/app/eco"
              className="p-5 rounded-[28px] bg-[#F8F9F6] hover:bg-slate-100 border border-black/5 flex flex-col justify-between space-y-3 transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-2xl bg-[#E8F876] text-[#121417] flex items-center justify-center font-bold">
                  <Leaf className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#121417]">
                  MOBI ECO Waste Rewards
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Earn 15 Mobi Coins per verified bin issue report across MEA Campus.
                </p>
              </div>
            </Link>

            <Link
              href="/app/events"
              className="p-5 rounded-[28px] bg-[#F8F9F6] hover:bg-slate-100 border border-black/5 flex flex-col justify-between space-y-3 transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-2xl bg-[#121417] text-white flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#121417]">
                  Symposiums & Festivals
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Redeem Mobi Coins for up to ₹100 discount on KAIZEN & MECHSURGE passes.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right 4 Columns */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top 2 Square Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/app/connect"
              className="p-5 rounded-[28px] bg-[#F8F9F6] hover:bg-slate-100 border border-black/5 flex flex-col justify-between h-32 transition-all shadow-sm group"
            >
              <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center text-slate-800 shadow-sm group-hover:scale-105 transition-transform">
                <Users2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-[#121417] block">Community</span>
                <span className="text-[10px] text-slate-400">120+ active</span>
              </div>
            </Link>

            <Link
              href="/app/events"
              className="p-5 rounded-[28px] bg-[#F8F9F6] hover:bg-slate-100 border border-black/5 flex flex-col justify-between h-32 transition-all shadow-sm group"
            >
              <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center text-slate-800 shadow-sm group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-[#121417] block">Symposiums</span>
                <span className="text-[10px] text-slate-400">4 upcoming</span>
              </div>
            </Link>
          </div>

          {/* Quick Access Directory List Cards */}
          <div className="space-y-2">
            {[
              {
                icon: FolderKanban,
                title: "Facilities Directory",
                desc: "19 verified waste bins & drinking water...",
                href: "/app/eco",
              },
              {
                icon: Newspaper,
                title: "Official Circulars",
                desc: "Bus schedules & college notices...",
                href: "/app/campus-connect",
              },
              {
                icon: TrendingUp,
                title: "Mobi Wallet Ledger",
                desc: "Check rewards & redemptions...",
                href: "/app/wallet",
              },
              {
                icon: Navigation,
                title: "3D Campus Route Planner",
                desc: "Calculate walking paths & ground truth...",
                href: "/app/map",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <Link
                  key={i}
                  href={card.href}
                  className="p-4 rounded-[24px] bg-[#F8F9F6] hover:bg-slate-100 border border-black/5 flex items-center justify-between transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-700 shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#121417]">{card.title}</h4>
                      <p className="text-[11px] text-slate-500">{card.desc}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Clean Campus FAQ Section (Positioned Cleanly at the Bottom) */}
      <div className="pt-6 border-t border-black/5">
        <div className="p-6 sm:p-8 rounded-[32px] bg-[#F8F9F6] border border-black/5 space-y-5">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm sm:text-base font-extrabold text-[#121417]">
              Campus Guide & Frequently Asked Questions
            </h3>
          </div>

          <div className="divide-y divide-slate-200/60">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="py-3">
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 py-1 group"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#121417] group-hover:text-black">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? "transform rotate-180 text-black" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.2 }}
                      className="pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Student Report Modal */}
      <StudentReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
