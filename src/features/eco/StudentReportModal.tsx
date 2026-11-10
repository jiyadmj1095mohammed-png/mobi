"use client";

import { useState } from "react";
import { ReportCategory } from "@/types/database";
import { useMobiStore } from "@/lib/state";
import { X, Upload, AlertCircle, CheckCircle2 } from "lucide-react";

interface StudentReportModalProps {
  isOpen?: boolean;
  onClose: () => void;
  initialBinId?: string;
  preselectedBinId?: string;
}

export default function StudentReportModal({
  isOpen = true,
  onClose,
  initialBinId,
  preselectedBinId,
}: StudentReportModalProps) {
  const { submitWasteReport } = useMobiStore();
  const [category, setCategory] = useState<ReportCategory>("overflowing");
  const [binId, setBinId] = useState<string>(preselectedBinId || initialBinId || "");
  const [locationName, setLocationName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (isOpen === false) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="w-full max-w-md rounded-2xl bg-[#FAF3E0] border-[2.5px] border-black shadow-[8px_8px_0px_#000] p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="brutal-btn absolute top-5 right-5 w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-black tracking-wider uppercase text-stone-500">
                MOBI ECO Stewardship
              </span>
              <h3 className="text-xl font-black text-black mt-0.5">
                Report Campus Issue
              </h3>
              <p className="text-xs font-bold text-stone-600 mt-1">
                Verified reports receive +15 Mobi Coins upon admin resolution.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#D84F2A] text-white text-xs font-black flex items-center gap-2 border-2 border-black">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-black mb-1.5 uppercase">
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
                    className={`brutal-btn py-2 px-3 rounded-xl text-xs font-black text-left ${
                      category === item.id
                        ? "bg-[#EEA827] text-black border-2 border-black"
                        : "bg-white text-black border-2 border-black"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {(category === "overflowing" || category === "damaged_bin") && (
              <div>
                <label className="block text-xs font-black text-black mb-1 uppercase">
                  Bin ID
                </label>
                <input
                  type="text"
                  value={binId}
                  onChange={(e) => setBinId(e.target.value.toUpperCase())}
                  placeholder="e.g. BIN-005"
                  className="w-full px-3.5 py-2 rounded-xl bg-white text-xs font-mono font-black uppercase text-black border-2 border-black focus:outline-none shadow-[2px_2px_0px_#000]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-black mb-1 uppercase">
                Location
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Main Block East Quad"
                className="w-full px-3.5 py-2 rounded-xl bg-white text-xs font-black text-black border-2 border-black focus:outline-none shadow-[2px_2px_0px_#000]"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black mb-1 uppercase">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the issue..."
                className="w-full px-3.5 py-2 rounded-xl bg-white text-xs font-bold text-black border-2 border-black focus:outline-none shadow-[2px_2px_0px_#000]"
              />
            </div>

            <div
              onClick={() => setHasPhoto(!hasPhoto)}
              className={`p-3.5 border-2 border-dashed border-black rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                hasPhoto
                  ? "bg-[#EEA827] text-black"
                  : "bg-white text-black hover:bg-stone-50"
              }`}
            >
              {hasPhoto ? (
                <div className="flex items-center gap-2 text-xs font-black">
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Photo Attached (evidence.jpg)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-black">
                  <Upload className="w-4 h-4" />
                  <span>Attach Photo (Optional)</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="brutal-btn w-full min-h-[44px] rounded-xl bg-[#D84F2A] hover:bg-[#c9431f] text-white text-xs font-black uppercase shadow-[3px_3px_0px_#000]"
            >
              Submit Report (+15 Coins)
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#EEA827] border-2 border-black text-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_#000]">
              ✓
            </div>
            <h3 className="text-xl font-black text-black">
              Report Submitted!
            </h3>
            <p className="text-xs font-bold text-stone-600 max-w-xs mx-auto">
              Your ticket is in the review queue. 15 Mobi Coins will be added to your wallet upon verification.
            </p>
            <button
              onClick={handleReset}
              className="brutal-btn px-6 py-2.5 rounded-xl bg-[#24201E] text-white font-black text-xs"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
