"use client";

import { useState } from "react";
import { useMobiStore } from "@/lib/state";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function TransactionHistory() {
  const { transactions } = useMobiStore();
  const [filter, setFilter] = useState<"all" | "mobi_coin" | "chat_point">("all");

  const filtered = transactions.filter((tx) => {
    if (filter === "all") return true;
    return tx.currency === filter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <h3 className="text-sm font-bold text-[#121417]">
          Transaction Ledger
        </h3>

        <div className="flex items-center gap-1.5 text-xs">
          {[
            { id: "all", label: "All" },
            { id: "mobi_coin", label: "Coins" },
            { id: "chat_point", label: "Points" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full font-semibold transition-all ${
                filter === tab.id
                  ? "bg-[#121417] text-white"
                  : "bg-[#F4F5F2] text-slate-600 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-[#F8F9F6] border border-black/5 overflow-hidden divide-y divide-slate-200/50">
        {filtered.length > 0 ? (
          filtered.map((tx) => {
            const isMobi = tx.currency === "mobi_coin";
            const isEarned = tx.action === "earned" || tx.action === "refunded";

            return (
              <div key={tx.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                      isMobi
                        ? "bg-white text-slate-900 shadow-sm"
                        : "bg-[#E8F876] text-black shadow-sm"
                    }`}
                  >
                    {isEarned ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#121417]">
                      {tx.description}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span className="font-mono text-[10px]">{tx.id}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-extrabold flex items-center justify-end gap-1 ${
                      isEarned ? "text-[#121417]" : "text-slate-500"
                    }`}
                  >
                    <span>
                      {isEarned ? "+" : "-"}
                      {tx.amount}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {isMobi ? "Coins" : "Pts"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {tx.action}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
}
