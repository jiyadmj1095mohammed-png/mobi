"use client";

import { useState, useRef, useEffect } from "react";
import { useMobiStore } from "@/lib/state";
import { ChatSession } from "@/types/database";
import CivicQuizModal from "./CivicQuizModal";
import ActiveChatRoom from "./ActiveChatRoom";
import { PeerMatchmaker } from "@/lib/peerChat";
import {
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  Lock,
  Users2,
  X,
  Compass,
  Sparkles,
} from "lucide-react";

export default function RandomChatLobby() {
  const { wallet, profile, spendChatPoint } = useMobiStore();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState("Looking for an available campus peer...");
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);

  const matchmakerRef = useRef<PeerMatchmaker | null>(null);

  // Clean up matchmaker on unmount
  useEffect(() => {
    return () => {
      matchmakerRef.current?.destroy();
    };
  }, []);

  const handleStartSearch = () => {
    if (wallet.chatPoints < 1) {
      setShowQuizModal(true);
      return;
    }

    const currentUserId = profile.id || `std-${Date.now()}`;
    const currentUserName = profile.fullName || "Student";
    const currentUserDept = profile.department || "Engineering";

    setIsSearching(true);
    setSearchStatus("Connecting to campus matchmaking pool...");

    const mm = new PeerMatchmaker({
      id: currentUserId,
      name: currentUserName,
      dept: currentUserDept,
    });
    matchmakerRef.current = mm;

    mm.findPeer(
      (session: ChatSession) => {
        spendChatPoint();
        setIsSearching(false);
        setActiveSession(session);
      },
      (status: string) => {
        setSearchStatus(status);
      }
    );
  };

  const handleCancelSearch = () => {
    matchmakerRef.current?.cancelSearch();
    setIsSearching(false);
  };

  if (activeSession) {
    return (
      <ActiveChatRoom
        session={activeSession}
        currentUserId={profile.id || "std-me"}
        currentUserName={profile.fullName || "Student"}
        onEndChat={() => {
          setActiveSession(null);
          setIsSearching(false);
        }}
        onNextChat={() => {
          setActiveSession(null);
          handleStartSearch();
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 font-sans">
      {/* Lobby Hero Card */}
      <div className="rounded-2xl bg-[#FAF3E0] border-[2.5px] border-black shadow-[6px_6px_0px_#000] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-[#1D838F] text-white border border-black shadow-[1.5px_1.5px_0px_#000]">
              MOBI CONNECT
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#EEA827] text-black border border-black">
              ✦ PEER DIALOGUE
            </span>
          </div>

          <div className="sticker-badge bg-[#EEA827] text-black text-xs px-3 py-1 rounded-md">
            <span>{wallet.chatPoints} Chat Points</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-black">
            Real Student Peer Dialogue
          </h2>
          <p className="text-xs sm:text-sm font-bold text-stone-600 leading-relaxed">
            One-on-one anonymous chat with a verified student from MEA Engineering College. Matches real campus students only.
          </p>
        </div>

        {/* Searching / Matchmaking Screen */}
        {isSearching ? (
          <div className="p-6 rounded-2xl bg-[#24201E] border-2 border-black text-white text-center space-y-4 shadow-[4px_4px_0px_#000]">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#EEA827] animate-ping opacity-40" />
              <div className="w-12 h-12 rounded-xl bg-[#EEA827] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                <RefreshCw className="w-5 h-5 text-black animate-spin" />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-white">
                Finding Available Campus Peer...
              </h4>
              <p className="text-xs text-[#EEA827] font-bold animate-pulse">
                {searchStatus}
              </p>
            </div>

            <button
              onClick={handleCancelSearch}
              className="brutal-btn px-6 py-2.5 rounded-xl bg-white text-black text-xs font-black"
            >
              Cancel Search
            </button>
          </div>
        ) : (
          <div>
            {wallet.chatPoints === 0 ? (
              <div className="p-4 rounded-xl bg-white border-2 border-black text-xs text-stone-700 space-y-3 shadow-[2px_2px_0px_#000]">
                <div className="flex items-center gap-1.5 font-black text-black">
                  <Lock className="w-4 h-4 text-[#D84F2A]" />
                  <span>0 Chat Points Remaining</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-bold">
                  You need at least 1 Chat Point to start a peer session. Complete the 3-question civic courtesy quiz to claim +3 Chat Points.
                </p>
                <button
                  onClick={() => setShowQuizModal(true)}
                  className="brutal-btn w-full min-h-[44px] rounded-xl bg-[#EEA827] hover:bg-[#e49c18] text-black text-xs font-black uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_#000]"
                >
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Take Courtesy Quiz (+3 Points)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleStartSearch}
                  className="brutal-btn w-full min-h-[48px] rounded-xl bg-[#EEA827] hover:bg-[#e49c18] text-black text-sm font-black uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000]"
                >
                  <Users2 className="w-4 h-4 text-black" />
                  <span>Start Student Peer Dialogue</span>
                </button>

                <div className="flex items-center justify-between text-xs text-stone-700 font-bold px-1">
                  <span>Balance: {wallet.chatPoints} Chat Points</span>
                  <button
                    onClick={() => setShowQuizModal(true)}
                    className="text-black font-black underline hover:text-[#D84F2A]"
                  >
                    Earn More Points (+3)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety & Guidelines Info */}
      <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_#000] space-y-2 text-xs text-stone-700">
        <h4 className="font-black text-black flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#1D838F]" />
          <span>Campus Safety & Community Standards</span>
        </h4>
        <ul className="list-disc list-inside space-y-1 text-xs font-bold leading-relaxed text-stone-600">
          <li>Sessions start only when a verified campus peer is connected.</li>
          <li>Never share passwords, financial details, or confidential credentials.</li>
          <li>Either student can disconnect or flag misconduct at any moment.</li>
        </ul>
      </div>

      {/* Courtesy Quiz Modal */}
      <CivicQuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        onSuccess={() => {
          setShowQuizModal(false);
        }}
      />
    </div>
  );
}
