"use client";

import { useState } from "react";
import EventsCatalog from "@/features/events/EventsCatalog";
import EventDetailModal from "@/features/events/EventDetailModal";
import { CampusEvent } from "@/types/database";
import { useMobiStore } from "@/lib/state";
import { Coins } from "lucide-react";

export default function MobiEventsPage() {
  const { wallet } = useMobiStore();
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);

  return (
    <div className="space-y-6 font-sans text-[#121417]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            MOBI EVENTS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] mt-0.5">
            Symposiums & Workshops
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Register for campus technical symposiums and apply Mobi Coins for fee discounts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F8F9F6] px-4 py-2 rounded-2xl border border-black/5 shrink-0 self-start sm:self-auto">
          <Coins className="w-4 h-4 text-slate-700" />
          <div className="text-xs font-bold text-[#121417]">{wallet.mobiCoins} Coins Available</div>
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
