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
    <div className="space-y-4 font-sans">
      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search facility name, water, restroom..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-black text-xs font-black text-black placeholder-stone-500 focus:outline-none shadow-[2px_2px_0px_#000]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
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
              className={`brutal-btn px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap ${
                category === cat.id
                  ? "bg-[#EEA827] text-black border-2 border-black"
                  : "bg-[#FAF3E0] text-black border-2 border-black"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((f) => {
          const isConfirmed = f.status === "confirmed";

          return (
            <div
              key={f.id}
              className="p-5 rounded-2xl bg-[#FAF3E0] border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white text-black border border-black shadow-[1.5px_1.5px_0px_#000]">
                    {f.id}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black flex items-center gap-1 ${
                      isConfirmed
                        ? "bg-[#879C74] text-white"
                        : "bg-[#EEA827] text-black"
                    }`}
                  >
                    {isConfirmed ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {f.status}
                  </span>
                </div>

                <h4 className="text-sm font-black text-black">
                  {f.name}
                </h4>

                <div className="flex items-center gap-1 text-xs font-bold text-stone-600">
                  <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
                  <span className="uppercase">{f.category}</span>
                </div>

                <p className="text-xs font-medium text-stone-600">
                  {f.note}
                </p>
              </div>

              <div className="pt-2 border-t border-black/10 text-[10px] font-black text-stone-500 uppercase flex items-center justify-between">
                <span>Verified Facility</span>
                <span className="text-[#1D838F]">MEA Campus</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
