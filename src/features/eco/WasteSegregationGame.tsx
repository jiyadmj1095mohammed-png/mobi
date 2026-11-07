"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { ECO_QUIZ_QUESTIONS } from "@/lib/state";
import { CheckCircle2, XCircle, RotateCcw, Sparkles } from "lucide-react";

export default function WasteSegregationGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = ECO_QUIZ_QUESTIONS[currentIndex];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex + 1 < ECO_QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-[32px] bg-[#F8F9F6] border border-black/5 p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
            MOBI ECO Simulator
          </span>
          <h2 className="text-lg font-bold text-[#121417]">
            Waste Sorting Quiz
          </h2>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#E8F876] text-xs font-bold text-[#121417]">
          {score} / {ECO_QUIZ_QUESTIONS.length}
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-5">
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#121417] h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / ECO_QUIZ_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>

          <div className="text-center p-6 rounded-[24px] bg-white border border-black/5 space-y-2">
            <div className="text-5xl">{currentQ.icon}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Item #{currentIndex + 1}
            </div>
            <h3 className="text-lg font-extrabold text-[#121417]">
              {currentQ.itemName}
            </h3>
            <p className="text-xs text-slate-500">
              Where does this item belong?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = "bg-white border-slate-200 hover:border-black text-slate-800";

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = "bg-[#121417] text-[#E8F876] border-black font-bold";
                } else if (isChosen) {
                  btnStyle = "bg-red-500 text-white border-red-500 font-bold";
                } else {
                  btnStyle = "opacity-40 border-slate-200";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`min-h-[48px] p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <span>{option}</span>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-[#E8F876] shrink-0" />
                  )}
                  {selectedOption !== null && isChosen && !isCorrect && (
                    <XCircle className="w-4 h-4 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="p-4 rounded-2xl bg-white border border-black/5 text-xs text-slate-700 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-[#121417]">
                <Sparkles className="w-4 h-4" />
                <span>Guideline Explanation:</span>
              </div>
              <p className="leading-relaxed text-slate-600">{currentQ.explanation}</p>
              <div className="pt-2">
                <button
                  onClick={handleNext}
                  className="w-full min-h-[42px] bg-[#121417] hover:bg-black text-white rounded-xl font-bold text-xs transition-all"
                >
                  {currentIndex + 1 < ECO_QUIZ_QUESTIONS.length ? "Next Item →" : "See Final Score"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="text-4xl">✦</div>
          <h3 className="text-lg font-bold text-[#121417]">
            Quiz Completed!
          </h3>
          <p className="text-xs text-slate-500">
            You sorted <strong className="text-[#121417]">{score}</strong> of {ECO_QUIZ_QUESTIONS.length} items correctly.
          </p>
          <button
            onClick={handleRestart}
            className="min-h-[44px] px-6 bg-[#121417] hover:bg-black text-white rounded-full font-bold text-xs inline-flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
