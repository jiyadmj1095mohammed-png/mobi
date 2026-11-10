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
    <div className="space-y-6 font-sans text-[#181514]">
      {/* Top Header Banner */}
      <div className="bg-[#FAF3E0] border-[2.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#1D838F] text-white border border-black shadow-[1.5px_1.5px_0px_#000]">
              MOBI ECO
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#EEA827] text-black border border-black">
              ✦ SUSTAINABILITY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            Waste Management & Campus Facilities
          </h1>
          <p className="text-xs sm:text-sm font-bold text-stone-600 mt-1">
            Sort waste, locate campus bins, and report overflowing areas for +15 Mobi Coins.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedBinId(undefined);
            setIsReportModalOpen(true);
          }}
          className="brutal-btn px-5 py-2.5 rounded-xl bg-[#D84F2A] hover:bg-[#c9431f] text-white text-xs font-black flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report Waste (+15 Coins)</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: "game", label: "Sorting Quiz", icon: Recycle },
          { id: "bins", label: "Bins Directory (19)", icon: Trash2 },
          { id: "facilities", label: "Restrooms & Water", icon: Droplets },
          { id: "reports", label: `My Reports (${reports.length})`, icon: AlertCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`brutal-btn px-4 py-2 rounded-xl font-black whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? "bg-[#EEA827] text-black border-2 border-black"
                  : "bg-[#FAF3E0] text-black border-2 border-black hover:bg-white"
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
          {reports.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF3E0] border-[2.5px] border-black rounded-2xl shadow-[4px_4px_0px_#000]">
              <p className="text-sm font-black text-black">No reports submitted yet.</p>
              <p className="text-xs font-bold text-stone-500 mt-1">Submit your first report to earn 15 Mobi Coins!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 rounded-2xl bg-[#FAF3E0] border-2 border-black shadow-[3px_3px_0px_#000] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black bg-white px-2 py-0.5 rounded border border-black text-black">
                      {rep.id}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-[#EEA827] text-black border border-black">
                      {rep.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-black">
                      {rep.locationName}
                    </h4>
                    <p className="text-xs font-bold text-stone-600 mt-0.5">
                      {rep.description}
                    </p>
                  </div>

                  <div className="text-[10px] font-bold text-stone-500 pt-1 border-t border-black/10 flex items-center justify-between">
                    <span>Submitted {rep.createdAt}</span>
                    <span className="text-[#1D838F] font-black">+15 Coins Pending</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <StudentReportModal
          preselectedBinId={selectedBinId}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
}
