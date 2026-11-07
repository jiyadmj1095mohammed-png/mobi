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
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: "all", label: "All Events" },
          { id: "computer", label: "CSE & AI" },
          { id: "civil", label: "Civil" },
          { id: "general", label: "Nature & Green" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilterDept(item.id)}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
              filterDept === item.id
                ? "bg-[#121417] text-white shadow-sm"
                : "bg-[#F4F5F2] text-slate-600 hover:text-black"
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
              className="rounded-[28px] bg-[#F8F9F6] border border-black/5 overflow-hidden flex flex-col justify-between space-y-4 hover:border-black/20 transition-all"
            >
              <div className="relative h-40 w-full bg-slate-200 overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-white/90 text-[#121417] text-[10px] font-bold shadow-sm backdrop-blur-sm">
                    {event.department.split(" ")[0]}
                  </span>
                  {event.fee === 0 ? (
                    <span className="px-3 py-1 rounded-full bg-[#E8F876] text-[#121417] text-[10px] font-bold shadow-sm">
                      Free Entry
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-white text-[#121417] text-[10px] font-bold shadow-sm">
                      ₹{event.fee} Fee
                    </span>
                  )}
                </div>

                {event.maxCoinDiscount > 0 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-[#121417] text-[#E8F876] text-[10px] font-bold">
                    <Coins className="w-3 h-3" />
                    <span>Up to {event.maxCoinDiscount} Coins Off</span>
                  </div>
                )}
              </div>

              <div className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#121417] leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-black/5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1 w-full truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {event.venue}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500 font-medium">
                    <strong className="text-[#121417]">{seatsLeft}</strong> seats left
                  </span>

                  {isRegistered ? (
                    <span className="px-4 py-2 rounded-full bg-[#E8F876] text-[#121417] text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectEvent(event)}
                      className="min-h-[40px] px-5 rounded-full bg-[#121417] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>Book Ticket</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
