"use client";

import { useState, useRef, useEffect } from "react";
import { EphemeralMessage, ChatSession } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Send, ShieldAlert, UserX, LogOut, CheckCheck, RefreshCw, ArrowRight } from "lucide-react";

interface ActiveChatRoomProps {
  session: ChatSession;
  currentUserId: string;
  currentUserName: string;
  onEndChat: () => void;
  onNextChat: () => void;
}

export default function ActiveChatRoom({
  session,
  currentUserId,
  currentUserName,
  onEndChat,
  onNextChat,
}: ActiveChatRoomProps) {
  const [messages, setMessages] = useState<EphemeralMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [peerDisconnected, setPeerDisconnected] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const broadcastRef = useRef<BroadcastChannel | null>(null);
  const supabaseChannelRef = useRef<any>(null);

  // Determine opponent's name and department
  const isUserA = currentUserId === session.participantA;
  const opponentName = isUserA ? session.participantBName : session.participantAName;
  const opponentDept = isUserA ? session.participantBDept : session.participantADept;

  useEffect(() => {
    // 1. Setup Local Cross-Tab Realtime Bus
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const bc = new BroadcastChannel(`mobi_room_${session.id}`);
      broadcastRef.current = bc;

      bc.onmessage = (event) => {
        const data = event.data;
        if (data.type === "CHAT_MSG" && data.senderId !== currentUserId) {
          setMessages((prev) => [...prev, data.message]);
        } else if (data.type === "PEER_DISCONNECT") {
          setPeerDisconnected(true);
        }
      };
    }

    // 2. Setup Supabase Realtime Broadcast & Postgres Sync
    if (isSupabaseConfigured) {
      const channel = supabase.channel(`live_room_${session.id}`, {
        config: { broadcast: { self: false } },
      });

      channel
        .on("broadcast", { event: "message" }, ({ payload }: any) => {
          if (payload && payload.senderId !== currentUserId) {
            setMessages((prev) => [...prev, payload]);
          }
        })
        .on("broadcast", { event: "disconnect" }, () => {
          setPeerDisconnected(true);
        })
        .subscribe();

      supabaseChannelRef.current = channel;
    }

    // Cleanup on unmount or session end
    return () => {
      broadcastRef.current?.postMessage({ type: "PEER_DISCONNECT" });
      broadcastRef.current?.close();

      if (supabaseChannelRef.current && isSupabaseConfigured) {
        supabaseChannelRef.current.send({
          type: "broadcast",
          event: "disconnect",
          payload: { senderId: currentUserId },
        });
        supabase.removeChannel(supabaseChannelRef.current);
      }
    };
  }, [session.id, currentUserId]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || peerDisconnected) return;

    const newMsg: EphemeralMessage = {
      id: `m-${Date.now()}`,
      sessionId: session.id,
      senderId: currentUserId,
      senderName: currentUserName,
      content: inputText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      delivered: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    broadcastRef.current?.postMessage({
      type: "CHAT_MSG",
      senderId: currentUserId,
      message: newMsg,
    });

    if (supabaseChannelRef.current && isSupabaseConfigured) {
      supabaseChannelRef.current.send({
        type: "broadcast",
        event: "message",
        payload: newMsg,
      });

      supabase
        .from("chat_messages")
        .insert({
          room_id: session.id,
          sender_id: currentUserId,
          sender_pseudonym: currentUserName,
          content: newMsg.content,
        })
        .then(() => {});
    }
  };

  const handleDisconnect = () => {
    broadcastRef.current?.postMessage({ type: "PEER_DISCONNECT" });
    if (supabaseChannelRef.current && isSupabaseConfigured) {
      supabaseChannelRef.current.send({
        type: "broadcast",
        event: "disconnect",
        payload: { senderId: currentUserId },
      });
    }
    onEndChat();
  };

  const handleReportAndBlock = () => {
    setIsBlocked(true);
    setShowReportModal(false);
    setTimeout(() => {
      handleDisconnect();
    }, 1000);
  };

  if (isBlocked) {
    return (
      <div className="p-8 text-center space-y-3 bg-[#FAF3E0] rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_#000] font-sans">
        <UserX className="w-8 h-8 text-[#D84F2A] mx-auto" />
        <h4 className="font-black text-sm text-black">User Reported & Disconnected</h4>
        <p className="text-xs font-bold text-stone-600">
          This peer has been blocked. Returning to lobby...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-[#FAF3E0] border-[2.5px] border-black flex flex-col h-[calc(88vh-2rem)] overflow-hidden shadow-[6px_6px_0px_#000] font-sans">
      {/* 1. Header (Peer info & controls) */}
      <div className="p-4 bg-white border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-[#EEA827] text-black border-2 border-black font-black text-xs flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
              {opponentName ? opponentName[0].toUpperCase() : "P"}
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-black ${
                peerDisconnected ? "bg-[#D84F2A]" : "bg-[#879C74] animate-pulse"
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-xs sm:text-sm text-black">
                {opponentName || "Campus Peer"}
              </h4>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#1D838F] text-white border border-black shadow-[1px_1px_0px_#000]">
                Live
              </span>
            </div>
            <p className="text-[11px] text-stone-600 font-bold">
              {opponentDept || "MEA Engineering College"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReportModal(true)}
            className="brutal-btn p-2 rounded-lg bg-white text-black hover:bg-[#D84F2A] hover:text-white"
            title="Report violation"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          <button
            onClick={handleDisconnect}
            className="brutal-btn px-3 py-1.5 rounded-lg bg-white text-black text-xs font-black flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Disconnect</span>
          </button>
        </div>
      </div>

      {/* 2. Message History Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF6EB]">
        {/* Greeting Banner */}
        <div className="p-3.5 rounded-xl bg-white border-2 border-black text-center space-y-1 shadow-[2px_2px_0px_#000]">
          <p className="text-xs font-black text-black">
            Connected with a peer from {opponentDept || "MEA College"}!
          </p>
          <p className="text-[10px] font-bold text-stone-500">
            Messages are ephemeral. Say hi to begin!
          </p>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed border-2 border-black shadow-[2px_2px_0px_#000] ${
                  isMe
                    ? "bg-[#EEA827] text-black"
                    : "bg-white text-black"
                }`}
              >
                <p className="break-words font-black">{msg.content}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-bold ${
                    isMe ? "text-black/60" : "text-stone-500"
                  }`}
                >
                  <span>{msg.createdAt}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-black" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Peer Disconnected Notice */}
        {peerDisconnected && (
          <div className="p-4 rounded-xl bg-white border-2 border-black text-center space-y-3 my-4 shadow-[3px_3px_0px_#000]">
            <p className="text-xs font-black text-black">
              Your peer has disconnected from this dialogue.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={onNextChat}
                className="brutal-btn px-5 py-2 rounded-xl bg-[#EEA827] text-black text-xs font-black flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Find New Peer</span>
              </button>
              <button
                onClick={onEndChat}
                className="brutal-btn px-4 py-2 rounded-xl bg-[#FAF3E0] text-black text-xs font-black"
              >
                Lobby
              </button>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* 3. Input Footer */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t-2 border-black flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={peerDisconnected}
          placeholder={
            peerDisconnected
              ? "Peer has disconnected. Click 'Find New Peer' above."
              : "Type a respectful message..."
          }
          className="flex-1 bg-[#FAF3E0] border-2 border-black rounded-xl px-4 py-2 text-xs font-black text-black placeholder-stone-500 focus:outline-none disabled:opacity-50 shadow-[1.5px_1.5px_0px_#000]"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || peerDisconnected}
          className="brutal-btn w-10 h-10 rounded-xl bg-[#EEA827] disabled:opacity-40 text-black flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#FAF3E0] border-[2.5px] border-black p-6 space-y-4 shadow-[8px_8px_0px_#000]">
            <h4 className="font-black text-base text-black">
              Report Community Violation
            </h4>
            <p className="text-xs font-bold text-stone-600">
              Please specify why you are reporting this peer:
            </p>
            <div className="space-y-1.5 text-xs">
              {["Inappropriate language", "Harassment or bullying", "Spam or promotions"].map(
                (reason) => (
                  <button
                    key={reason}
                    onClick={() => setReportReason(reason)}
                    className={`brutal-btn w-full p-2.5 rounded-xl text-left font-black ${
                      reportReason === reason
                        ? "bg-[#EEA827] text-black border-2 border-black"
                        : "bg-white text-black border-2 border-black"
                    }`}
                  >
                    {reason}
                  </button>
                )
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="brutal-btn flex-1 py-2 text-xs font-black bg-white text-black rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReportAndBlock}
                disabled={!reportReason}
                className="brutal-btn flex-1 py-2 rounded-xl bg-[#D84F2A] disabled:opacity-50 text-white text-xs font-black"
              >
                Block & Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
