"use client";

import { useState } from "react";
import { WasteBin } from "@/types/database";
import { INITIAL_BINS } from "@/lib/state";
import { Trash2, AlertCircle, CheckCircle, Search } from "lucide-react";

interface WasteBinDirectoryProps {
  onReportBin?: (binId: string) => void;
}

const CATEGORY_STYLES: Record<WasteBin["category"], { label: string; badge: string }> = {
  general: { label: "General Waste", badge: "bg-white text-black border border-black" },
  dry: { label: "Dry Recyclable", badge: "bg-[#EEA827] text-black border border-black" },
  wet: { label: "Organic Wet", badge: "bg-[#879C74] text-white border border-black" },
  plastic: { label: "Plastic", badge: "bg-[#D84F2A] text-white border border-black" },
  ewaste: { label: "E-Waste", badge: "bg-[#1D838F] text-white border border-black" },
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
      {/* Search & Category Filter Pills */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Bin ID or location (e.g. BIN-005)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-black text-xs font-black text-black placeholder-stone-500 focus:outline-none shadow-[2px_2px_0px_#000]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {["all", "general", "dry", "wet", "plastic", "ewaste"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`brutal-btn px-3 py-1.5 rounded-lg font-black capitalize whitespace-nowrap ${
                filter === cat
                  ? "bg-[#EEA827] text-black border-2 border-black"
                  : "bg-[#FAF3E0] text-black border-2 border-black"
              }`}
            >
              {cat === "all" ? "All Bins" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Bins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBins.map((bin) => {
          const style = CATEGORY_STYLES[bin.category];
          const isFull = bin.condition === "full" || bin.condition === "damaged";

          return (
            <div
              key={bin.id}
              className="p-5 rounded-2xl bg-[#FAF3E0] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-black bg-white px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_#000]">
                    {bin.id}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded ${style.badge}`}>
                    {style.label}
                  </span>
                </div>

                <h4 className="text-sm font-black text-black">
                  {bin.locationName}
                </h4>

                <div className="text-xs text-stone-600 font-bold space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Condition:</span>
                    <span
                      className={`font-black capitalize flex items-center gap-1 ${
                        isFull ? "text-[#D84F2A]" : "text-[#1D838F]"
                      }`}
                    >
                      {isFull ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      {bin.condition}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onReportBin?.(bin.id)}
                className="brutal-btn w-full py-2 rounded-xl text-xs font-black bg-white hover:bg-[#EEA827] text-black text-center"
              >
                Report Issue (+15 Coins)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
