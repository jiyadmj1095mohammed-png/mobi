"use client";

import { useState } from "react";
import { ReportCategory } from "@/types/database";
import { useMobiStore } from "@/lib/state";
import { X, Upload, AlertCircle, CheckCircle2 } from "lucide-react";

interface StudentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBinId?: string;
}

export default function StudentReportModal({ isOpen, onClose, initialBinId }: StudentReportModalProps) {
  const { submitWasteReport } = useMobiStore();
  const [category, setCategory] = useState<ReportCategory>("overflowing");
  const [binId, setBinId] = useState<string>(initialBinId || "");
  const [locationName, setLocationName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim()) {
      setError("Please specify the location");
      return;
    }
    if ((category === "overflowing" || category === "damaged_bin") && !binId.trim()) {
      setError("Please specify the Bin ID (e.g. BIN-005)");
      return;
    }
    if (!description.trim() || description.length < 5) {
      setError("Please provide a short description");
      return;
    }

    submitWasteReport(category, locationName.trim(), description.trim(), binId.trim());
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setError("");
    setLocationName("");
    setDescription("");
    setBinId("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121417]/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-[32px] bg-white border border-black/5 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-black"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                MOBI ECO Stewardship
              </span>
              <h3 className="text-xl font-bold text-[#121417] mt-0.5">
                Report Campus Issue
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verified reports receive 15 Mobi Coins upon resolution.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "overflowing", label: "Overflowing Bin" },
                  { id: "damaged_bin", label: "Damaged Bin" },
                  { id: "improper_dumping", label: "Pathway Litter" },
                  { id: "unclean_area", label: "Restroom Issue" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as ReportCategory)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all ${
                      category === item.id
                        ? "bg-[#121417] text-white shadow-sm"
                        : "bg-[#F4F5F2] text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {(category === "overflowing" || category === "damaged_bin") && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bin ID
                </label>
                <input
                  type="text"
                  value={binId}
                  onChange={(e) => setBinId(e.target.value.toUpperCase())}
                  placeholder="e.g. BIN-005"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F5F2] text-xs font-mono uppercase text-[#121417] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Main Block East Quad"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F5F2] text-xs text-[#121417] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the issue..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F5F2] text-xs text-[#121417] focus:outline-none"
              />
            </div>

            <div
              onClick={() => setHasPhoto(!hasPhoto)}
              className={`p-3.5 border border-dashed rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                hasPhoto
                  ? "border-[#121417] bg-[#F4F5F2] text-[#121417]"
                  : "border-slate-300 text-slate-400 hover:border-slate-500"
              }`}
            >
              {hasPhoto ? (
                <div className="flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Photo Attached (evidence.jpg)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Upload className="w-4 h-4" />
                  <span>Attach Photo (Optional)</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] rounded-2xl bg-[#121417] hover:bg-black text-white text-xs font-bold transition-all shadow-md"
            >
              Submit Report
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#E8F876] text-[#121417] flex items-center justify-center font-bold text-xl">
              ✓
            </div>
            <h3 className="text-lg font-bold text-[#121417]">
              Report Logged
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your ticket is in the review queue. 15 Mobi Coins will be added upon verification.
            </p>
            <button
              onClick={handleReset}
              className="min-h-[40px] px-6 rounded-full bg-[#121417] text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
