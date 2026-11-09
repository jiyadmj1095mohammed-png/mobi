"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { CampusEvent, EventRegistration } from "@/types/database";
import { useMobiStore } from "@/lib/state";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import EmailVerificationGate from "./EmailVerificationGate";
import { X, Calendar, Clock, MapPin, Coins, Ticket, AlertCircle } from "lucide-react";

interface EventDetailModalProps {
  event: CampusEvent | null;
  onClose: () => void;
}

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const { wallet, registerForEvent } = useMobiStore();
  const [coinsToUse, setCoinsToUse] = useState<number>(0);
  const [confirmedReg, setConfirmedReg] = useState<EventRegistration | null>(null);
  const [error, setError] = useState<string>("");
  const [showVerification, setShowVerification] = useState(false);

  if (!event) return null;

  const maxApplicableCoins = Math.min(event.fee, event.maxCoinDiscount, wallet.mobiCoins);
  const discountAmount = coinsToUse;
  const finalPrice = Math.max(0, event.fee - discountAmount);

  const completeRegistration = () => {
    const res = registerForEvent(event.id, coinsToUse);
    if (res.success && res.registration) {
      setConfirmedReg(res.registration);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setError(res.message || "Failed to process registration");
    }
  };

  const handleRegister = async () => {
    setError("");
    if (!isSupabaseConfigured) {
      setShowVerification(true);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError || !data.user?.email_confirmed_at) {
        setShowVerification(true);
        return;
      }

      completeRegistration();
    } catch {
      setShowVerification(true);
    }
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

        {!confirmedReg ? (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {event.department}
              </span>
              <h2 className="text-xl font-bold text-[#121417] leading-tight mt-0.5">
                {event.title}
              </h2>
              <div className="text-xs text-slate-500 flex flex-wrap gap-2.5 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {event.time}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {event.description}
            </p>

            {error && (
              <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Mobi Coin Discount Slider */}
            {event.fee > 0 && (
              <div className="p-4 rounded-2xl bg-[#F8F9F6] border border-black/5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#121417] flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-slate-700" />
                    Mobi Coin Discount
                  </span>
                  <span className="text-slate-500">
                    Wallet: <strong>{wallet.mobiCoins} Coins</strong>
                  </span>
                </div>

                {maxApplicableCoins > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Apply Coins:</span>
                      <span className="font-bold text-[#121417]">
                        {coinsToUse} Coins (-₹{coinsToUse})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={maxApplicableCoins}
                      value={coinsToUse}
                      onChange={(e) => setCoinsToUse(Number(e.target.value))}
                      className="w-full accent-[#121417] cursor-pointer"
                    />
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Earn Mobi Coins through waste reports to unlock fee discounts.
                  </p>
                )}
              </div>
            )}

            {/* Price Summary */}
            <div className="p-3.5 rounded-2xl bg-[#F4F5F2] text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Standard Fee:</span>
                <span>₹{event.fee}</span>
              </div>
              {coinsToUse > 0 && (
                <div className="flex justify-between text-slate-800 font-semibold">
                  <span>Coins Discount:</span>
                  <span>- ₹{coinsToUse}</span>
                </div>
              )}
              <div className="pt-1.5 border-t border-slate-300 flex justify-between font-bold text-sm text-[#121417]">
                <span>Payable Amount:</span>
                <span>{finalPrice === 0 ? "Free" : `₹${finalPrice}`}</span>
              </div>
            </div>

            <button
              onClick={handleRegister}
              className="w-full min-h-[46px] rounded-2xl bg-[#121417] hover:bg-black text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Confirm Ticket</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-5 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#E8F876] text-[#121417] flex items-center justify-center font-bold text-xl">
              ✓
            </div>
            <h3 className="text-lg font-bold text-[#121417]">
              Ticket Confirmed
            </h3>
            <div className="p-4 rounded-2xl bg-[#121417] text-white text-left space-y-2">
              <div className="text-[10px] text-slate-400 font-mono">ID: {confirmedReg.id}</div>
              <div className="font-bold text-sm text-[#E8F876]">{confirmedReg.eventTitle}</div>
              <div className="text-xs text-slate-300">Attendee: {confirmedReg.userName}</div>
              <div className="text-xs text-slate-400 pt-1 border-t border-white/10 flex justify-between">
                <span>Coins Used: {confirmedReg.coinsUsed}</span>
                <span className="font-bold text-white">Paid: ₹{confirmedReg.finalPaid}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="min-h-[42px] px-6 rounded-full bg-[#121417] text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        )}
      </div>
      {showVerification && (
        <EmailVerificationGate
          onClose={() => setShowVerification(false)}
          onVerified={() => {
            setShowVerification(false);
            completeRegistration();
          }}
        />
      )}
    </div>
  );
}
