"use client";

import React from "react";

interface MobiLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon" | "minimal";
  theme?: "dark" | "light";
}

export function MobiMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MOBI Brand Emblem"
    >
      {/* Outer rounded squircle container */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="18"
        fill="#000000"
      />
      
      {/* Geometric Interlocking Evergreen Leaf + M Flow */}
      {/* Left Leaf / Stem */}
      <path
        d="M18 45V25C18 20 22 17 27 20L32 24L37 20C42 17 46 20 46 25V45"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Sprout Leaf & Connecting Node */}
      <path
        d="M32 24V37"
        stroke="#EEA827"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      <circle
        cx="32"
        cy="43"
        r="3"
        fill="#EEA827"
      />

      {/* Evergreen Leaf Accent */}
      <path
        d="M32 15C32 15 38 18 38 23C38 28 32 30 32 30C32 30 26 28 26 23C26 18 32 15 32 15Z"
        fill="#16A34A"
        opacity="0.9"
      />
    </svg>
  );
}

export default function MobiLogo({
  className = "",
  size = "md",
  variant = "full",
  theme = "dark",
}: MobiLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const isDark = theme === "dark";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <MobiMark className={`${iconSizes[size]} transition-transform hover:scale-105`} />

      {variant === "full" && (
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-black tracking-tight leading-none ${textSizes[size]} ${
                isDark ? "text-[#000000]" : "text-[#FFFFFF]"
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.04em" }}
            >
              MOBI
            </span>
            <span
              className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.2 rounded-sm border ${
                isDark
                  ? "bg-[#000000] text-white border-black"
                  : "bg-white text-black border-white"
              }`}
            >
              OS
            </span>
          </div>
          <span
            className={`text-[8.5px] font-bold tracking-wider uppercase leading-tight ${
              isDark ? "text-[#6F6F6F]" : "text-[#FFFFFF]/70"
            }`}
          >
            Evergreen Campus · MEA
          </span>
        </div>
      )}

      {variant === "minimal" && (
        <span
          className={`font-black tracking-tight ${textSizes[size]} ${
            isDark ? "text-[#000000]" : "text-[#FFFFFF]"
          }`}
          style={{ letterSpacing: "-0.04em" }}
        >
          MOBI<sup className="text-xs font-normal ml-0.5">®</sup>
        </span>
      )}
    </div>
  );
}
