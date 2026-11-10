"use client";

import { useState } from "react";
import { CampusEvent } from "@/types/database";
import { useMobiStore } from "@/lib/state";
import { Calendar, Clock, MapPin, Coins, ArrowRight, Check } from "lucide-react";

interface EventsCatalogProps {
  onSelectEvent: (event: CampusEvent) => void;
}

export default function EventsCatalog({ onSelectEvent }: EventsCatalogProps) {
  const { events, registrations } = useMobiStore();
  const [filterDept, setFilterDept] = useState<string>("all");

  const filteredEvents = events.filter((e) => {
    if (filterDept === "all") return true;
    return e.department.toLowerCase().includes(filterDept.toLowerCase());
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: "all", label: "All Events" },
          { id: "computer", label: "CSE & AI" },
          { id: "civil", label: "Civil" },
          { id: "general", label: "Nature & Green" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilterDept(item.id)}
            className={`brutal-btn px-4 py-2 rounded-xl font-black whitespace-nowrap ${
              filterDept === item.id
                ? "bg-[#EEA827] text-black border-2 border-black"
                : "bg-[#FAF3E0] text-black border-2 border-black"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map((event) => {
          const isRegistered = registrations.some((r) => r.eventId === event.id);
          const seatsLeft = Math.max(0, event.totalSeats - event.registeredCount);

          return (
            <div
              key={event.id}
              className="rounded-2xl bg-[#FAF3E0] border-[2.5px] border-black shadow-[4px_4px_0px_#000] overflow-hidden flex flex-col justify-between space-y-4"
            >
              <div className="relative h-44 w-full bg-stone-200 overflow-hidden border-b-2 border-black">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 rounded-md bg-[#FAF3E0] text-black text-[10px] font-black uppercase border border-black shadow-[1.5px_1.5px_0px_#000]">
                    {event.department.split(" ")[0]}
                  </span>
                  {event.fee === 0 ? (
                    <span className="px-3 py-1 rounded-md bg-[#EEA827] text-black text-[10px] font-black uppercase border border-black shadow-[1.5px_1.5px_0px_#000]">
                      Free Entry
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-md bg-white text-black text-[10px] font-black uppercase border border-black shadow-[1.5px_1.5px_0px_#000]">
                      ₹{event.fee} Entry
                    </span>
                  )}
                </div>

                {event.maxCoinDiscount > 0 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1 rounded-md bg-[#1D838F] text-white text-[10px] font-black border border-black shadow-[1.5px_1.5px_0px_#000]">
                    <Coins className="w-3.5 h-3.5" />
                    <span>Save ₹{event.maxCoinDiscount} w/ Coins</span>
                  </div>
                )}
              </div>

              <div className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-black leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-xs font-bold text-stone-600 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-bold text-stone-700 bg-white p-3 rounded-xl border border-black shadow-[1.5px_1.5px_0px_#000]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-black" />
                    {event.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-black" />
                    {event.time}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-black" />
                    {event.venue}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/10">
                  <span className="text-[11px] font-black text-stone-600">
                    {seatsLeft} Seats Remaining
                  </span>

                  <button
                    onClick={() => onSelectEvent(event)}
                    className={`brutal-btn px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                      isRegistered
                        ? "bg-[#879C74] text-white"
                        : "bg-[#EEA827] hover:bg-[#e29d1c] text-black"
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Pass Confirmed</span>
                      </>
                    ) : (
                      <>
                        <span>View Pass & Redeem</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
