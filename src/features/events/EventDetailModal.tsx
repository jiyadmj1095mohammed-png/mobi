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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="w-full max-w-md rounded-2xl bg-[#FAF3E0] border-[2.5px] border-black shadow-[8px_8px_0px_#000] p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="brutal-btn absolute top-5 right-5 w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black"
        >
          <X className="w-4 h-4" />
        </button>

        {!confirmedReg ? (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#1D838F] text-white border border-black shadow-[1.5px_1.5px_0px_#000]">
                {event.department}
              </span>
              <h2 className="text-xl font-black text-black leading-tight mt-2">
                {event.title}
              </h2>
              <div className="text-xs font-bold text-stone-600 flex flex-wrap gap-2.5 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-black" />
                  {event.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-black" />
                  {event.time}
                </span>
              </div>
            </div>

            <p className="text-xs font-medium text-stone-700 leading-relaxed">
              {event.description}
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-[#D84F2A] text-white text-xs font-black flex items-center gap-2 border-2 border-black">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Mobi Coin Discount Slider */}
            {event.fee > 0 && (
              <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-black flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-black" />
                    Mobi Coin Discount
                  </span>
                  <span className="text-stone-600 font-bold">
                    Wallet: <strong>{wallet.mobiCoins} Coins</strong>
                  </span>
                </div>

                {maxApplicableCoins > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-stone-600">Apply Coins:</span>
                      <span className="text-[#1D838F]">
                        {coinsToUse} Coins (-₹{coinsToUse})
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={maxApplicableCoins}
                      value={coinsToUse}
                      onChange={(e) => setCoinsToUse(Number(e.target.value))}
                      className="w-full accent-[#EEA827] cursor-pointer"
                    />
                  </div>
                ) : (
                  <p className="text-[11px] font-bold text-stone-500">
                    Earn Mobi Coins through waste reports to unlock event pass discounts.
                  </p>
                )}
              </div>
            )}

            {/* Price Summary */}
            <div className="p-3.5 rounded-xl bg-white border-2 border-black text-xs font-bold space-y-1 shadow-[2px_2px_0px_#000]">
              <div className="flex justify-between text-stone-600">
                <span>Standard Fee:</span>
                <span>₹{event.fee}</span>
              </div>
              {coinsToUse > 0 && (
                <div className="flex justify-between text-[#1D838F] font-black">
                  <span>Coins Discount:</span>
                  <span>- ₹{coinsToUse}</span>
                </div>
              )}
              <div className="pt-1.5 border-t-2 border-black/10 flex justify-between font-black text-sm text-black">
                <span>Payable Amount:</span>
                <span>{finalPrice === 0 ? "Free" : `₹${finalPrice}`}</span>
              </div>
            </div>

            <button
              onClick={handleRegister}
              className="brutal-btn w-full min-h-[44px] rounded-xl bg-[#EEA827] hover:bg-[#e49c18] text-black font-black text-xs uppercase shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Confirm Pass Registration</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-5 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#EEA827] border-2 border-black text-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_#000]">
              ✓
            </div>
            <h3 className="text-xl font-black text-black">
              Pass Confirmed!
            </h3>
            <div className="p-4 rounded-xl bg-[#24201E] border-2 border-black text-white text-left space-y-2 shadow-[3px_3px_0px_#000]">
              <div className="text-[10px] text-stone-400 font-mono">ID: {confirmedReg.id}</div>
              <div className="font-black text-sm text-[#EEA827]">{confirmedReg.eventTitle}</div>
              <div className="text-xs text-stone-300">Attendee: {confirmedReg.userName}</div>
              <div className="text-xs text-stone-400 pt-1 border-t border-white/10 flex justify-between">
                <span>Coins Used: {confirmedReg.coinsUsed}</span>
                <span className="font-black text-white">Paid: ₹{confirmedReg.finalPaid}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="brutal-btn px-6 py-2.5 rounded-xl bg-[#24201E] text-white font-black text-xs"
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
