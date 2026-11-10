"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { CIVIC_QUIZ_QUESTIONS, useMobiStore } from "@/lib/state";
import { CheckCircle2, XCircle, RotateCcw, X, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-md rounded-2xl bg-[#FAF3E0] border-[2.5px] border-black shadow-[8px_8px_0px_#000] p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="brutal-btn absolute top-5 right-5 w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black"
        >
          <X className="w-4 h-4" />
        </button>

        {!isFinished ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-stone-500 tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1D838F]" />
                <span>Question {currentIdx + 1} of {CIVIC_QUIZ_QUESTIONS.length}</span>
              </div>
              <h3 className="text-xl font-black text-black mt-0.5">
                Campus Civic Courtesy Quiz
              </h3>
              <p className="text-xs font-bold text-stone-600">
                Answer correctly to uphold campus guidelines and claim +3 Chat Points.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white h-2.5 rounded-full border-2 border-black overflow-hidden p-0.5">
              <div
                className="bg-[#EEA827] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIdx + 1) / CIVIC_QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>

            {/* Question Card */}
            <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black text-black leading-relaxed">
              {currentQ.question}
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let btnClass = "bg-white text-black border-2 border-black hover:bg-[#EEA827]";

                if (selectedOpt !== null) {
                  if (isSelected && isCorrect) {
                    btnClass = "bg-[#1D838F] text-white border-2 border-black font-black";
                  } else if (isSelected && !isCorrect) {
                    btnClass = "bg-[#D84F2A] text-white border-2 border-black font-black";
                  } else if (isCorrect) {
                    btnClass = "bg-[#879C74] text-white border-2 border-black font-black";
                  } else {
                    btnClass = "opacity-40 bg-white border-2 border-black";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selectedOpt !== null}
                    className={`brutal-btn w-full p-3 rounded-xl text-xs text-left flex items-center justify-between gap-2 ${btnClass}`}
                  >
                    <span>{option}</span>
                    {selectedOpt !== null && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
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
                  className="brutal-btn w-full min-h-[44px] bg-[#EEA827] hover:bg-[#e49c18] text-black rounded-xl font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000]"
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
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EEA827] border-2 border-black text-black flex items-center justify-center font-black text-2xl shadow-[3px_3px_0px_#000]">
              ✦
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                Civic Courtesy Verified
              </span>
              <h3 className="text-xl font-black text-black mt-0.5">
                +3 Chat Points Credited!
              </h3>
              <p className="text-xs font-bold text-stone-600 max-w-xs mx-auto mt-1 leading-relaxed">
                Thank you for upholding respectful campus dialogue. Your Chat Points balance is now{" "}
                <span className="font-black text-black">{wallet.chatPoints} Points</span>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border-2 border-black text-xs text-black flex items-center justify-center gap-2 font-black shadow-[2px_2px_0px_#000]">
              <Sparkles className="w-4 h-4 text-[#EEA827]" />
              <span>You are now ready to match with peers!</span>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="brutal-btn w-full min-h-[44px] px-6 rounded-xl bg-[#24201E] text-white font-black text-xs uppercase shadow-[2px_2px_0px_#000]"
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
