"use client";

import { useState } from "react";
import { WasteBin } from "@/types/database";
import { INITIAL_BINS } from "@/lib/state";
import { Trash2, AlertCircle, CheckCircle, Search } from "lucide-react";

interface WasteBinDirectoryProps {
  onReportBin?: (binId: string) => void;
}

const CATEGORY_STYLES: Record<WasteBin["category"], { label: string; badge: string }> = {
  general: { label: "General", badge: "bg-slate-100 text-slate-800" },
  dry: { label: "Dry Recyclable", badge: "bg-[#E8F876] text-[#121417]" },
  wet: { label: "Organic Wet", badge: "bg-emerald-100 text-emerald-800" },
  plastic: { label: "Plastic", badge: "bg-orange-100 text-orange-800" },
  ewaste: { label: "E-Waste", badge: "bg-red-100 text-red-800" },
};

export default function WasteBinDirectory({ onReportBin }: WasteBinDirectoryProps) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filteredBins = INITIAL_BINS.filter((bin) => {
    if (filter !== "all" && bin.category !== filter) return false;
    if (
      search &&
      !bin.id.toLowerCase().includes(search.toLowerCase()) &&
      !bin.locationName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Bin ID or location (e.g. BIN-005)..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-[#F4F5F2] text-xs text-[#121417] focus:outline-none border border-transparent focus:border-black/10"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {["all", "general", "dry", "wet", "plastic", "ewaste"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold capitalize whitespace-nowrap transition-all ${
                filter === cat
                  ? "bg-[#121417] text-white"
                  : "bg-[#F4F5F2] text-slate-600 hover:text-black"
              }`}
            >
              {cat === "all" ? "All Bins" : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredBins.map((bin) => {
          const style = CATEGORY_STYLES[bin.category];
          const isFull = bin.condition === "full" || bin.condition === "damaged";

          return (
            <div
              key={bin.id}
              className="p-5 rounded-[24px] bg-[#F8F9F6] border border-black/5 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#121417] bg-white px-2.5 py-1 rounded-xl shadow-sm">
                    {bin.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${style.badge}`}>
                    {style.label}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-[#121417]">
                  {bin.locationName}
                </h4>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Condition:</span>
                    <span
                      className={`font-semibold capitalize flex items-center gap-1 ${
                        isFull ? "text-amber-600" : "text-emerald-700"
                      }`}
                    >
                      {isFull ? <AlertCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {bin.condition}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Serviced:</span>
                    <span>{bin.lastServiced}</span>
                  </div>
                </div>
              </div>

              {onReportBin && (
                <button
                  onClick={() => onReportBin(bin.id)}
                  className="w-full min-h-[36px] rounded-xl bg-white hover:bg-slate-100 border border-black/5 text-xs font-semibold text-[#121417] flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Trash2 className="w-3 h-3 text-slate-600" />
                  Report Issue
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
