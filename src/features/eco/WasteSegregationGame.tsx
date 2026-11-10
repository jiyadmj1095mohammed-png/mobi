"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { ECO_QUIZ_QUESTIONS } from "@/lib/state";
import { CheckCircle2, XCircle, RotateCcw, Sparkles, ArrowRight } from "lucide-react";

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
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-[#FAF3E0] border-[2.5px] border-black shadow-[6px_6px_0px_#000] p-6 space-y-6">
      <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase text-stone-500">
            MOBI ECO Simulator
          </span>
          <h2 className="text-lg font-black text-black">
            Waste Sorting Quiz
          </h2>
        </div>
        <div className="px-3 py-1 rounded-lg bg-[#EEA827] border-2 border-black text-xs font-black text-black shadow-[1.5px_1.5px_0px_#000]">
          Score: {score} / {ECO_QUIZ_QUESTIONS.length}
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-5">
          {/* Progress bar */}
          <div className="w-full bg-white h-3 rounded-full border-2 border-black overflow-hidden p-0.5">
            <div
              className="bg-[#D84F2A] h-full rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / ECO_QUIZ_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>

          <div className="text-center p-6 rounded-xl bg-white border-2 border-black shadow-[3px_3px_0px_#000] space-y-2">
            <div className="text-5xl">{currentQ.icon}</div>
            <div className="text-[10px] text-stone-500 uppercase tracking-wider font-black">
              Item #{currentIndex + 1}
            </div>
            <h3 className="text-xl font-black text-black">
              {currentQ.itemName}
            </h3>
            <p className="text-xs font-bold text-stone-600">
              Which category bin should this item be placed in?
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = "bg-white hover:bg-[#EEA827] text-black border-2 border-black shadow-[2px_2px_0px_#000]";

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = "bg-[#1D838F] text-white border-2 border-black shadow-[2px_2px_0px_#000] font-black";
                } else if (isChosen) {
                  btnStyle = "bg-[#D84F2A] text-white border-2 border-black shadow-[2px_2px_0px_#000] font-black";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`brutal-btn p-3.5 rounded-xl text-left text-xs sm:text-sm font-black flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <span>{option}</span>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                  {selectedOption !== null && isChosen && !isCorrect && (
                    <XCircle className="w-4 h-4 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next */}
          {selectedOption !== null && (
            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-xs font-black text-black">
                {selectedOption === currentQ.correctIndex ? "🎉 Correct! +1 Point" : "Incorrect. Check campus bin rules."}
              </span>
              <button
                onClick={handleNext}
                className="brutal-btn px-5 py-2.5 rounded-xl bg-[#EEA827] text-black text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]"
              >
                <span>{currentIndex + 1 < ECO_QUIZ_QUESTIONS.length ? "Next Item" : "See Results"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EEA827] border-2 border-black shadow-[3px_3px_0px_#000] mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-black" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-black">Quiz Completed!</h3>
            <p className="text-sm font-bold text-stone-600 mt-1">
              You correctly sorted {score} out of {ECO_QUIZ_QUESTIONS.length} campus waste items.
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="brutal-btn px-6 py-3 rounded-xl bg-[#24201E] text-white text-xs font-black inline-flex items-center gap-2 shadow-[3px_3px_0px_#000]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
}
