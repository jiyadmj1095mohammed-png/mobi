"use client";

import { useState } from "react";
import { useMobiStore } from "@/lib/state";
import { Pin, ShieldCheck } from "lucide-react";

export default function AnnouncementsFeed() {
  const { announcements } = useMobiStore();
  const [filter, setFilter] = useState<string>("all");

  const filtered = announcements.filter((a) => {
    if (filter === "all") return true;
    return a.category === filter;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: "all", label: "All Notices" },
          { id: "official", label: "Official Circulars" },
          { id: "campaign", label: "Facility Updates" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`brutal-btn px-4 py-2 rounded-xl font-black whitespace-nowrap ${
              filter === tab.id
                ? "bg-[#EEA827] text-black border-2 border-black"
                : "bg-[#FAF3E0] text-black border-2 border-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_#000] space-y-2.5 transition-all ${
              item.pinned
                ? "bg-[#FAF3E0]"
                : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-[#EEA827] text-black border border-black shadow-[1.5px_1.5px_0px_#000]">
                  {item.category.toUpperCase()}
                </span>
                {item.department && (
                  <span className="text-xs font-bold text-stone-600">
                    {item.department}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {item.pinned && (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase text-[#D84F2A] bg-white px-2 py-0.5 rounded border border-black">
                    <Pin className="w-3 h-3 fill-[#D84F2A]" />
                    Pinned
                  </span>
                )}
                <span className="text-xs font-bold text-stone-500 font-mono">
                  {item.createdAt}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-black">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-stone-700 mt-1 leading-relaxed">
                {item.content}
              </p>
            </div>

            <div className="pt-2 border-t-2 border-black/10 flex items-center justify-between text-[11px] font-bold text-stone-500">
              <span className="flex items-center gap-1 text-[#1D838F] font-black">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Administration Desk
              </span>
              <span>MEA Official Record</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
