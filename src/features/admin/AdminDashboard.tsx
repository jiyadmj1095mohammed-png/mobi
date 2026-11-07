"use client";

import { useState } from "react";
import { useMobiStore } from "@/lib/state";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Coins,
  Megaphone,
  Plus,
  UserCheck,
} from "lucide-react";

export default function AdminDashboard() {
  const {
    reports,
    reviewReport,
    addAnnouncement,
    announcements,
    isAdminView,
    toggleRole,
    profile,
  } = useMobiStore();

  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<"official" | "campaign" | "club" | "opportunity">("official");
  const [newDept, setNewDept] = useState("Administration");
  const [annSuccess, setAnnSuccess] = useState(false);

  const pendingReports = reports.filter((r) => r.status === "pending");
  const approvedReports = reports.filter((r) => r.status === "approved");
  const totalCoinsAwarded = approvedReports.reduce((sum, r) => sum + r.rewardAmount, 0);

  const filteredReports = reports.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addAnnouncement(newTitle.trim(), newContent.trim(), newCategory, newDept);
    setNewTitle("");
    setNewContent("");
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans text-[#121417]">
      {/* Admin RBAC Header */}
      <div className="p-6 rounded-[28px] bg-[#121417] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-white/10 text-[#E8F876]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold text-[#E8F876] uppercase tracking-wider">
              Administration Cell
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Campus Governance Console
          </h2>
          <p className="text-xs text-slate-400">
            Current User: {profile.fullName || "Admin"} ({profile.role.toUpperCase()})
          </p>
        </div>

        <button
          onClick={toggleRole}
          className="px-4 py-2 rounded-full bg-white text-[#121417] text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Switch to {isAdminView ? "Student" : "Admin"}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-[24px] bg-[#F8F9F6] border border-black/5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Reports</span>
          <div className="text-2xl font-extrabold text-[#121417]">
            {pendingReports.length}
          </div>
        </div>

        <div className="p-4 rounded-[24px] bg-[#F8F9F6] border border-black/5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Approved Reports</span>
          <div className="text-2xl font-extrabold text-[#121417]">
            {approvedReports.length}
          </div>
        </div>

        <div className="p-4 rounded-[24px] bg-[#E8F876] border border-black/5 space-y-1 text-[#121417]">
          <span className="text-[10px] text-black/60 font-bold uppercase tracking-wider">Coins Awarded</span>
          <div className="text-2xl font-extrabold flex items-center gap-1">
            <span>{totalCoinsAwarded}</span>
            <Coins className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-[24px] bg-[#F8F9F6] border border-black/5 space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Circulars</span>
          <div className="text-2xl font-extrabold text-[#121417]">
            {announcements.length}
          </div>
        </div>
      </div>

      {/* Reports Review Queue */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#121417]">
              Waste Report Review Queue
            </h3>
            <p className="text-xs text-slate-500">
              Approved reports automatically award 15 Mobi Coins to the student.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {["pending", "approved", "all"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-full font-semibold capitalize transition-all ${
                  filterStatus === status
                    ? "bg-[#121417] text-white"
                    : "bg-[#F4F5F2] text-slate-600 hover:text-black"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredReports.map((report) => {
            const isPending = report.status === "pending";

            return (
              <div
                key={report.id}
                className="p-5 rounded-[24px] bg-[#F8F9F6] border border-black/5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-lg border border-black/5">
                        {report.id}
                      </span>
                      {report.binId && (
                        <span className="font-bold text-xs text-[#121417] bg-[#E8F876] px-2 py-0.5 rounded-lg">
                          {report.binId}
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white text-slate-700">
                        {report.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#121417] mt-1.5">
                      {report.locationName}
                    </h4>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-2xl border border-black/5">
                  {report.description}
                </p>

                {report.adminNotes && (
                  <div className="text-xs text-slate-700 bg-[#E8F876]/40 p-2.5 rounded-xl">
                    <strong>Admin Note:</strong> {report.adminNotes}
                  </div>
                )}

                {isPending && (
                  <div className="pt-2 flex gap-2 justify-end border-t border-slate-200/50">
                    <button
                      onClick={() =>
                        reviewReport(
                          report.id,
                          "rejected",
                          "Unable to verify report."
                        )
                      }
                      className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() =>
                        reviewReport(
                          report.id,
                          "approved",
                          "Sanitation cleared. 15 Mobi Coins credited."
                        )
                      }
                      className="px-4 py-2 rounded-full bg-[#121417] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E8F876]" />
                      <span>Approve (+15 Coins)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Notice Form */}
      <div className="p-6 rounded-[28px] bg-[#F8F9F6] border border-black/5 space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-[#121417]">
            Broadcast Campus Notice
          </h3>
        </div>

        {annSuccess && (
          <div className="p-3 rounded-2xl bg-[#E8F876] text-[#121417] text-xs font-bold">
            Notice published to all students!
          </div>
        )}

        <form onSubmit={handlePostAnnouncement} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notice Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Schedule Update"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/5 text-xs text-[#121417] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/5 text-xs text-[#121417] focus:outline-none"
              >
                <option value="official">Official Notice</option>
                <option value="campaign">Facilities & Eco</option>
                <option value="club">Club Announcement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notice Content
            </label>
            <textarea
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter announcement text..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/5 text-xs text-[#121417] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="min-h-[42px] px-6 rounded-full bg-[#121417] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>
        </form>
      </div>
    </div>
  );
}
