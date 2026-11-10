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
    <div className="space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <h3 className="text-base font-black text-black">
          Transaction Ledger History
        </h3>

        <div className="flex items-center gap-2 text-xs">
          {[
            { id: "all", label: "All Records" },
            { id: "mobi_coin", label: "Mobi Coins" },
            { id: "chat_point", label: "Chat Points" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`brutal-btn px-3 py-1.5 rounded-lg font-black transition-all ${
                filter === tab.id
                  ? "bg-[#EEA827] text-black border-2 border-black"
                  : "bg-[#FAF3E0] text-black border-2 border-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-[#FAF3E0] border-[2.5px] border-black shadow-[4px_4px_0px_#000] overflow-hidden divide-y-2 divide-black/10">
        {filtered.length > 0 ? (
          filtered.map((tx) => {
            const isMobi = tx.currency === "mobi_coin";
            const isEarned = tx.action === "earned" || tx.action === "refunded";

            return (
              <div key={tx.id} className="p-4 flex items-center justify-between gap-3 hover:bg-white/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#000] ${
                      isMobi
                        ? "bg-[#1D838F] text-white"
                        : "bg-[#EEA827] text-black"
                    }`}
                  >
                    {isEarned ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-black">
                      {tx.description}
                    </div>
                    <div className="text-[10px] font-bold text-stone-500 font-mono mt-0.5">
                      {tx.id} • {tx.createdAt}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-xs sm:text-sm font-black ${
                      isEarned ? "text-[#1D838F]" : "text-[#D84F2A]"
                    }`}
                  >
                    {isEarned ? "+" : "-"}
                    {tx.amount} {isMobi ? "Coins" : "Pts"}
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white border border-black inline-block mt-0.5">
                    {tx.action}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-xs font-bold text-stone-500">
            No transactions found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
