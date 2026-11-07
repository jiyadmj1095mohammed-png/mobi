"use client";

import { useMobiStore } from "@/lib/state";
import { Coins, MessageSquare, Lock, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function WalletOverview() {
  const { wallet } = useMobiStore();

  return (
    <div className="space-y-6">
      {/* Policy Notice */}
      <div className="p-4 rounded-2xl bg-[#F8F9F6] border border-black/5 text-xs text-slate-600 flex items-center gap-3">
        <Lock className="w-4 h-4 text-[#121417] shrink-0" />
        <span>
          <strong>Currency Separation:</strong> Mobi Coins are earned from verified waste reports and discount event passes. Chat Points are earned via civic quizzes and permit starting student chat sessions.
        </span>
      </div>

      {/* Two Clean Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mobi Coins Card (Clean White/Muted Card with segmented bar) */}
        <div className="p-6 rounded-[28px] bg-[#F8F9F6] border border-black/5 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-800">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Campus Utility
                </span>
                <h3 className="text-sm font-bold text-[#121417]">Mobi Coins</h3>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-white text-[#121417] border border-black/5 font-bold">
              1 Coin = ₹1 Disc.
            </span>
          </div>

          <div>
            <div className="text-4xl font-extrabold text-[#121417] tracking-tight">
              {wallet.mobiCoins}
              <span className="text-xs font-semibold text-slate-400 ml-1.5">Coins</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Applicable directly to symposium passes and tech workshops.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Earn from Waste Reports
            </span>
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Redeem on Events
            </span>
          </div>
        </div>

        {/* Chat Points Card (Pale Citron Card from Reference) */}
        <div className="p-6 rounded-[28px] bg-[#E8F876] text-[#121417] flex flex-col justify-between space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/70 shadow-sm flex items-center justify-center text-[#121417]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/60">
                  Communication
                </span>
                <h3 className="text-sm font-bold text-[#121417]">Chat Points</h3>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-white text-[#121417] font-bold">
              1 Pt = 1 Session
            </span>
          </div>

          <div>
            <div className="text-4xl font-extrabold text-[#121417] tracking-tight">
              {wallet.chatPoints}
              <span className="text-xs font-semibold text-black/60 ml-1.5">Points</span>
            </div>
            <p className="text-xs text-black/70 mt-1">
              Pass the civic courtesy quiz to earn points for random peer chats.
            </p>
          </div>

          <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs text-black/70 font-medium">
            <span className="flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Earn via Civic Quiz
            </span>
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Start Peer Match
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
