"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { CIVIC_QUIZ_QUESTIONS, useMobiStore } from "@/lib/state";
import { CheckCircle2, XCircle, RotateCcw, X, ShieldCheck, Sparkles } from "lucide-react";

interface CivicQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CivicQuizModal({ isOpen, onClose, onSuccess }: CivicQuizModalProps) {
  const { awardCivicQuizPoints, wallet } = useMobiStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [pointsGranted, setPointsGranted] = useState(false);

  if (!isOpen) return null;

  const currentQ = CIVIC_QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
  };

  const handleNext = () => {
    if (selectedOpt === null) return;

    const updatedAnswers = [...userAnswers, selectedOpt];
    setUserAnswers(updatedAnswers);
    setSelectedOpt(null);

    if (currentIdx + 1 < CIVIC_QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Quiz Completed! Award 3 Chat Points directly and reliably
      setIsFinished(true);
      if (!pointsGranted) {
        awardCivicQuizPoints();
        setPointsGranted(true);
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setUserAnswers([]);
    setIsFinished(false);
    setPointsGranted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121417]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[32px] bg-white border border-black/10 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto font-sans">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-black transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isFinished ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#121417]" />
                <span>Question {currentIdx + 1} of {CIVIC_QUIZ_QUESTIONS.length}</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#121417] mt-0.5">
                Campus Civic Courtesy Quiz
              </h3>
              <p className="text-[11px] text-slate-500">
                Complete this 3-question quiz to verify respectful campus dialogue and earn +3 Chat Points.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#121417] h-full transition-all duration-300"
                style={{
                  width: `${((currentIdx + 1) / CIVIC_QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>

            {/* Question Card */}
            <div className="p-4 rounded-2xl bg-[#F8F9F6] border border-black/5 text-xs font-bold text-[#121417] leading-relaxed">
              {currentQ.question}
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let btnClass = "bg-white border-slate-200 hover:border-black text-slate-800";

                if (selectedOpt !== null) {
                  if (isSelected && isCorrect) {
                    btnClass = "bg-[#121417] border-[#121417] text-white font-bold";
                  } else if (isSelected && !isCorrect) {
                    btnClass = "bg-red-500 border-red-500 text-white font-bold";
                  } else if (isCorrect) {
                    btnClass = "border-[#121417] bg-[#E8F876]/40 text-[#121417] font-bold";
                  } else {
                    btnClass = "opacity-40 border-slate-200";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selectedOpt !== null}
                    className={`w-full min-h-[46px] p-3 rounded-2xl border text-xs text-left flex items-center justify-between gap-2 transition-all ${btnClass}`}
                  >
                    <span>{option}</span>
                    {selectedOpt !== null && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-[#E8F876] shrink-0" />
                    )}
                    {selectedOpt !== null && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOpt !== null && (
              <div className="pt-2">
                <button
                  onClick={handleNext}
                  className="w-full min-h-[44px] bg-[#121417] hover:bg-black text-white rounded-full font-extrabold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>
                    {currentIdx + 1 < CIVIC_QUIZ_QUESTIONS.length
                      ? "Next Question →"
                      : "Complete Quiz & Claim Points ✦"}
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Finished Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F876] text-[#121417] flex items-center justify-center font-black text-2xl shadow-md">
              ✦
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Civic Courtesy Verified
              </span>
              <h3 className="text-xl font-extrabold text-[#121417] mt-0.5">
                +3 Chat Points Credited!
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1 leading-relaxed">
                Thank you for upholding respectful campus dialogue. Your Chat Points balance is now{" "}
                <span className="font-extrabold text-[#121417]">{wallet.chatPoints} Points</span>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8F9F6] border border-black/5 text-xs text-[#121417] flex items-center justify-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>You are now ready to match with peers!</span>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full min-h-[44px] px-6 rounded-full bg-[#121417] hover:bg-black text-white font-extrabold text-xs transition-all shadow-md active:scale-95"
              >
                Proceed to Matchmaking →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
