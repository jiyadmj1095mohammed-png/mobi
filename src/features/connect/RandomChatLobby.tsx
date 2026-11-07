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
        // Real Peer Matched! Deduct 1 Chat Point now that chat has officially begun
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
      <div className="rounded-[32px] bg-[#F8F9F6] border border-black/5 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#121417] text-[#E8F876] flex items-center justify-center font-bold text-xs">
              ✦
            </div>
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              MOBI CONNECT
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F876] text-xs font-black text-[#121417] shadow-sm">
            <span>{wallet.chatPoints} Chat Points</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#121417]">
            Real Campus Peer Dialogue
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            One-on-one anonymous chat with a verified student from MEA Engineering College. Matches real students only — no bots, no AI.
          </p>
        </div>

        {/* Searching / Matchmaking Screen (Omegle style) */}
        {isSearching ? (
          <div className="p-6 rounded-2xl bg-[#121417] text-white text-center space-y-4 shadow-xl">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#E8F876]/40 animate-ping opacity-40" />
              <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-[#E8F876] animate-spin" />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-white">
                Looking for an Opponent...
              </h4>
              <p className="text-xs text-[#E8F876] font-medium animate-pulse">
                {searchStatus}
              </p>
            </div>

            <p className="text-[11px] text-white/50 max-w-xs mx-auto leading-relaxed border-t border-white/10 pt-3">
              💡 <span className="text-white/80 font-bold">Pro Tip:</span> Open this website in a second tab or incognito window to chat with yourself instantly!
            </p>

            <button
              onClick={handleCancelSearch}
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
            >
              Cancel Search
            </button>
          </div>
        ) : (
          <div>
            {wallet.chatPoints === 0 ? (
              <div className="p-4 rounded-2xl bg-[#F4F5F2] border border-black/5 text-xs text-slate-600 space-y-3">
                <div className="flex items-center gap-1.5 font-extrabold text-[#121417]">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>0 Chat Points Remaining</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  You need at least 1 Chat Point to start a peer session. Answer 3 quick courtesy questions to claim +3 Chat Points.
                </p>
                <button
                  onClick={() => setShowQuizModal(true)}
                  className="w-full min-h-[44px] rounded-full bg-[#121417] hover:bg-black text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-[#E8F876]" />
                  <span>Take Courtesy Quiz (+3 Points)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleStartSearch}
                  className="w-full min-h-[48px] rounded-full bg-[#121417] hover:bg-black text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Users2 className="w-4 h-4 text-[#E8F876]" />
                  <span>Find Campus Peer (Costs 1 Point)</span>
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-500 px-2">
                  <span>Current balance: {wallet.chatPoints} points</span>
                  <button
                    onClick={() => setShowQuizModal(true)}
                    className="text-[#121417] font-bold underline hover:text-black"
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
      <div className="p-5 rounded-[24px] bg-[#F8F9F6] border border-black/5 space-y-2 text-xs text-slate-500">
        <h4 className="font-extrabold text-[#121417] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Omegle-Style Anonymous Safety Standards</span>
        </h4>
        <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
          <li>Sessions start only after a real opponent is paired.</li>
          <li>Never share sensitive passwords, roll numbers, or bank details.</li>
          <li>Either party can disconnect or report harassment at any time.</li>
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
