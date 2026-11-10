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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="w-full max-w-md bg-[#FAF3E0] rounded-2xl p-7 sm:p-8 shadow-[8px_8px_0px_#000] border-[2.5px] border-black space-y-6">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EEA827] text-black border-2 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_#000]">
            ✦
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight">
            Welcome to MOBI
          </h2>
          <p className="text-xs font-bold text-stone-600 max-w-xs mx-auto">
            Please enter your name and department to personalize your MEA campus ecosystem.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#D84F2A] text-white text-xs text-center font-black border-2 border-black">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-black uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-black" />
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
              placeholder="e.g. Aisha Rahman"
              className="w-full px-4 py-2.5 rounded-xl bg-white text-xs font-black text-black outline-none border-2 border-black shadow-[2px_2px_0px_#000]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-black uppercase flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-black" />
              <span>Department</span>
            </label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white text-xs font-black text-black outline-none border-2 border-black shadow-[2px_2px_0px_#000]"
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
            className="brutal-btn w-full min-h-[44px] rounded-xl bg-[#EEA827] hover:bg-[#e29d1c] text-black text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] mt-2"
          >
            <span>Enter Campus</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
