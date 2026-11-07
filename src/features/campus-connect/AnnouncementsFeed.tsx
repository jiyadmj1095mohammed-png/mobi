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
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: "all", label: "All Notices" },
          { id: "official", label: "Official" },
          { id: "campaign", label: "Facilities" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
              filter === tab.id
                ? "bg-[#121417] text-white shadow-sm"
                : "bg-[#F4F5F2] text-slate-600 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-[24px] border space-y-2.5 transition-all ${
              item.pinned
                ? "bg-white border-black/15 shadow-sm"
                : "bg-[#F8F9F6] border-black/5"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F876] text-[#121417]">
                  {item.category.toUpperCase()}
                </span>
                {item.department && (
                  <span className="text-[11px] text-slate-400">
                    {item.department}
                  </span>
                )}
              </div>

              {item.pinned && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#121417] bg-[#F4F5F2] px-2.5 py-0.5 rounded-full">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#121417]">
              {item.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {item.content}
            </p>

            <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-slate-600" />
                {item.author}
              </span>
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
