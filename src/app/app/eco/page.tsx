"use client";

import { useState } from "react";
import WasteSegregationGame from "@/features/eco/WasteSegregationGame";
import WasteBinDirectory from "@/features/eco/WasteBinDirectory";
import FacilityDirectory from "@/features/eco/FacilityDirectory";
import StudentReportModal from "@/features/eco/StudentReportModal";
import { useMobiStore } from "@/lib/state";
import { Recycle, Trash2, Droplets, AlertCircle, Plus } from "lucide-react";

export default function MobiEcoPage() {
  const { reports } = useMobiStore();
  const [activeTab, setActiveTab] = useState<"game" | "bins" | "facilities" | "reports">("game");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedBinId, setSelectedBinId] = useState<string | undefined>(undefined);

  const handleReportBin = (binId: string) => {
    setSelectedBinId(binId);
    setIsReportModalOpen(true);
  };

  return (
    <div className="space-y-6 font-sans text-[#121417]">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            MOBI ECO
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] mt-0.5">
            Waste Management & Facilities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sort waste, locate campus bins, and report issues for 15 Mobi Coins.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedBinId(undefined);
            setIsReportModalOpen(true);
          }}
          className="min-h-[42px] px-5 rounded-full bg-[#121417] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report Waste Issue</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: "game", label: "Sorting Quiz", icon: Recycle },
          { id: "bins", label: "Bins Directory (19)", icon: Trash2 },
          { id: "facilities", label: "Restrooms & Water", icon: Droplets },
          { id: "reports", label: `My Reports (${reports.length})`, icon: AlertCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "bg-[#121417] text-white shadow-sm"
                  : "bg-[#F4F5F2] text-slate-600 hover:text-black"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "game" && <WasteSegregationGame />}
      {activeTab === "bins" && <WasteBinDirectory onReportBin={handleReportBin} />}
      {activeTab === "facilities" && <FacilityDirectory />}
      {activeTab === "reports" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-[24px] bg-[#F8F9F6] border border-black/5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded-lg border border-black/5 text-slate-700">
                    {rep.id}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-white text-slate-700">
                    {rep.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#121417]">
                    {rep.locationName}
                  </h4>
                  <div className="text-[11px] text-slate-400">
                    {rep.category.replace("_", " ")}
                    {rep.binId && ` · Bin: ${rep.binId}`}
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-white p-3 rounded-2xl border border-black/5">
                  {rep.description}
                </p>

                {rep.adminNotes && (
                  <div className="text-[11px] text-[#121417] bg-[#E8F876]/40 p-2.5 rounded-xl">
                    <strong>Admin:</strong> {rep.adminNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      <StudentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialBinId={selectedBinId}
      />
    </div>
  );
}
