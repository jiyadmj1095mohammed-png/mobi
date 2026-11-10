"use client";

import { useMobiStore } from "@/lib/state";
import { Coins, MessageSquare, Lock, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function WalletOverview() {
  const { wallet } = useMobiStore();

  return (
    <div className="space-y-6 font-sans">
      {/* Policy Notice */}
      <div className="p-4 rounded-xl bg-[#FAF3E0] border-2 border-black shadow-[3px_3px_0px_#000] text-xs font-bold text-black flex items-center gap-3">
        <Lock className="w-4 h-4 text-black shrink-0" />
        <span>
          <strong>Strict Currency Separation:</strong> Mobi Coins are earned from approved eco waste reports and grant pass discounts. Chat Points are earned via civic quizzes to unlock student peer chat sessions.
        </span>
      </div>

      {/* Two Clean Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mobi Coins Card */}
        <div className="p-6 rounded-2xl bg-[#FAF3E0] border-[2.5px] border-black shadow-[5px_5px_0px_#000] flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EEA827] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                  Campus Utility
                </span>
                <h3 className="text-base font-black text-black">Mobi Coins</h3>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded bg-white text-black border border-black font-black">
              1 Coin = ₹1 Disc.
            </span>
          </div>

          <div>
            <div className="text-4xl font-black text-black tracking-tight">
              {wallet.mobiCoins}
              <span className="text-xs font-black text-stone-500 ml-2">Coins</span>
            </div>
            <p className="text-xs font-bold text-stone-600 mt-1">
              Applicable directly to college tech symposium passes and workshops.
            </p>
          </div>

          <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between text-xs text-stone-600 font-bold">
            <span className="flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-[#1D838F]" />
              Earn from Reports
            </span>
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D84F2A]" />
              Redeem on Events
            </span>
          </div>
        </div>

        {/* Chat Points Card */}
        <div className="p-6 rounded-2xl bg-[#EEA827] border-[2.5px] border-black shadow-[5px_5px_0px_#000] flex flex-col justify-between space-y-6 text-black">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-black/60">
                  Communication
                </span>
                <h3 className="text-base font-black text-black">Chat Points</h3>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded bg-[#FAF3E0] text-black border border-black font-black">
              1 Session = 1 Pt
            </span>
          </div>

          <div>
            <div className="text-4xl font-black text-black tracking-tight">
              {wallet.chatPoints}
              <span className="text-xs font-black text-black/70 ml-2">Points</span>
            </div>
            <p className="text-xs font-bold text-black/80 mt-1">
              Civic balance required to enter peer-to-peer discussions.
            </p>
          </div>

          <div className="pt-3 border-t-2 border-black/10 flex items-center justify-between text-xs text-black/80 font-bold">
            <span className="flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Earn from Civic Quiz
            </span>
            <span className="flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              1 Point per Match
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
