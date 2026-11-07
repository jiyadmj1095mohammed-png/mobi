"use client";

import { useState } from "react";
import { useMobiStore } from "@/lib/state";
import { ArrowRight, User, Building2, Sparkles } from "lucide-react";

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Information Technology",
  "Architecture & Design",
];

export default function OnboardingModal() {
  const { profile, saveProfile, isLoaded } = useMobiStore();
  const [name, setName] = useState("");
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [error, setError] = useState("");

  if (!isLoaded || profile.isOnboarded) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    saveProfile(name.trim(), dept);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121417]/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-[32px] p-7 sm:p-8 shadow-2xl border border-black/5 space-y-6">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#E8F876] text-[#121417] flex items-center justify-center font-bold text-lg">
            ✦
          </div>
          <h2 className="text-2xl font-extrabold text-[#121417] tracking-tight">
            Welcome to MOBI
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Please enter your name and department to personalize your campus dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Alex Mohammed"
              className="w-full px-4 py-3 rounded-2xl bg-[#F4F5F2] text-sm text-[#121417] font-medium outline-none focus:ring-2 focus:ring-[#121417] border border-transparent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Department</span>
            </label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#F4F5F2] text-sm text-[#121417] font-medium outline-none focus:ring-2 focus:ring-[#121417] border border-transparent"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] rounded-2xl bg-[#121417] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
