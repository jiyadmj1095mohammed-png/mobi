"use client";

import { useState } from "react";
import { FACILITIES, CampusFacilityData, FACILITY_COLORS } from "@/data/campusData";
import { CheckCircle2, AlertTriangle, Droplets, MapPin, Search } from "lucide-react";

export default function FacilityDirectory() {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const filtered = FACILITIES.filter((f) => {
    if (category !== "all" && f.category !== category) return false;
    if (
      search &&
      !f.name.toLowerCase().includes(search.toLowerCase()) &&
      !f.id.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search facility name, water, restroom..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: "All Facilities" },
            { id: "sanitation", label: "Restrooms & Handwash" },
            { id: "hydration", label: "Purified Water" },
            { id: "amenity", label: "Seating & Lights" },
            { id: "transit", label: "Transit & Access" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                category === cat.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((fac) => {
          const isConfirmed = fac.status === "confirmed";
          const color = FACILITY_COLORS[fac.type] || "#10B981";

          return (
            <div
              key={fac.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-bold text-xs px-2.5 py-1 rounded-lg text-white"
                  style={{ backgroundColor: color }}
                >
                  {fac.id}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isConfirmed
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                  }`}
                >
                  {isConfirmed ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Confirmed
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Proposed
                    </>
                  )}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {fac.name}
                </h4>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  Local Coords: ({fac.pos[0].toFixed(1)}, {fac.pos[1].toFixed(1)})
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl text-[11px] leading-relaxed ${
                  isConfirmed
                    ? "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"
                    : "bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
                }`}
              >
                {fac.note}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
