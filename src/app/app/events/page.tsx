"use client";

import { useState } from "react";
import EventsCatalog from "@/features/events/EventsCatalog";
import EventDetailModal from "@/features/events/EventDetailModal";
import { CampusEvent } from "@/types/database";
import { useMobiStore } from "@/lib/state";
import { Coins, Sparkles } from "lucide-react";

export default function MobiEventsPage() {
  const { wallet } = useMobiStore();
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);

  return (
    <div className="space-y-6 font-sans text-[#181514]">
      {/* Header Banner */}
      <div className="bg-[#FAF3E0] border-[2.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#EEA827] text-black border border-black shadow-[1.5px_1.5px_0px_#000]">
              MOBI EVENTS
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#1D838F] text-white border border-black">
              ✦ PASSES & DISCOUNTS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            Campus Events & Symposiums
          </h1>
          <p className="text-xs sm:text-sm font-bold text-stone-600 mt-1">
            Browse upcoming technical symposiums and apply Mobi Coins for instant registration discounts.
          </p>
        </div>

        <div className="brutal-btn flex items-center gap-2 bg-[#EEA827] px-4 py-2.5 rounded-xl border-2 border-black shrink-0 self-start sm:self-auto">
          <Coins className="w-4 h-4 text-black" />
          <div className="text-xs font-black text-black">{wallet.mobiCoins} Mobi Coins Available</div>
        </div>
      </div>

      <EventsCatalog onSelectEvent={setSelectedEvent} />

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
