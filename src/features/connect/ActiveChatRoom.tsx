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

  // Send Message (Real human communication — zero AI bots)
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

    // Add to local screen
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Broadcast to peer via local bus
    broadcastRef.current?.postMessage({
      type: "CHAT_MSG",
      senderId: currentUserId,
      message: newMsg,
    });

    // Broadcast to peer via Supabase
    if (supabaseChannelRef.current && isSupabaseConfigured) {
      supabaseChannelRef.current.send({
        type: "broadcast",
        event: "message",
        payload: newMsg,
      });

      // Also persist to Supabase chat_messages
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
      <div className="p-8 text-center space-y-3 bg-[#F8F9F6] rounded-[32px] border border-black/5 font-sans">
        <UserX className="w-8 h-8 text-red-500 mx-auto" />
        <h4 className="font-extrabold text-sm text-[#121417]">User Reported & Disconnected</h4>
        <p className="text-xs text-slate-500">
          This peer has been blocked. Returning to lobby...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto rounded-[32px] bg-[#F8F9F6] border border-black/5 flex flex-col h-[calc(88vh-2rem)] overflow-hidden shadow-xl font-sans">
      {/* 1. Header (Peer info & Omegle controls) */}
      <div className="p-4 bg-white border-b border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#121417] text-[#E8F876] font-extrabold text-xs flex items-center justify-center">
              {opponentName ? opponentName[0].toUpperCase() : "P"}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                peerDisconnected ? "bg-red-500" : "bg-emerald-500 animate-pulse"
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-xs sm:text-sm text-[#121417]">
                {opponentName || "Campus Peer"}
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F876] text-[#121417]">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {opponentDept || "MEA Engineering College"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowReportModal(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Report violation"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          <button
            onClick={handleDisconnect}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#121417] text-xs font-bold flex items-center gap-1 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Disconnect</span>
          </button>
        </div>
      </div>

      {/* 2. Message History Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAFBF8]">
        {/* Omegle-Style Greeting Banner */}
        <div className="p-3.5 rounded-2xl bg-white border border-black/5 text-center space-y-1 shadow-sm">
          <p className="text-xs font-bold text-[#121417]">
            You are now connected with a student from {opponentDept || "MEA College"}!
          </p>
          <p className="text-[10px] text-slate-400">
            Messages are ephemeral. Say hi to start the conversation!
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
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                  isMe
                    ? "bg-[#121417] text-white rounded-br-none"
                    : "bg-white text-[#121417] border border-black/5 rounded-bl-none"
                }`}
              >
                <p className="break-words">{msg.content}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                    isMe ? "text-white/50" : "text-slate-400"
                  }`}
                >
                  <span>{msg.createdAt}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-[#E8F876]" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Peer Disconnected Notice (Omegle style) */}
        {peerDisconnected && (
          <div className="p-4 rounded-2xl bg-slate-200/80 text-center space-y-3 my-4 animate-in fade-in">
            <p className="text-xs font-bold text-slate-700">
              Stranger has disconnected from the chat.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={onNextChat}
                className="px-5 py-2 rounded-full bg-[#121417] hover:bg-black text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#E8F876]" />
                <span>Find New Peer</span>
              </button>
              <button
                onClick={onEndChat}
                className="px-4 py-2 rounded-full bg-white text-slate-700 text-xs font-bold"
              >
                Return to Lobby
              </button>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* 3. Input Footer */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-black/5 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={peerDisconnected}
          placeholder={
            peerDisconnected
              ? "Your peer has disconnected. Click 'Find New Peer' above."
              : "Type a respectful message..."
          }
          className="flex-1 bg-[#F8F9F6] border border-black/5 rounded-full px-4 py-2.5 text-xs text-[#121417] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black/20 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || peerDisconnected}
          className="w-10 h-10 rounded-full bg-[#121417] hover:bg-black disabled:bg-slate-300 text-white flex items-center justify-center transition-all shadow-sm shrink-0"
        >
          <Send className="w-4 h-4 text-[#E8F876]" />
        </button>
      </form>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-6 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-sm text-[#121417]">
              Report Community Violation
            </h4>
            <p className="text-xs text-slate-500">
              Please specify why you are reporting this peer:
            </p>
            <div className="space-y-1.5 text-xs">
              {["Inappropriate language", "Harassment or bullying", "Spam or promotions"].map(
                (reason) => (
                  <button
                    key={reason}
                    onClick={() => setReportReason(reason)}
                    className={`w-full p-2.5 rounded-xl border text-left font-semibold ${
                      reportReason === reason
                        ? "border-[#121417] bg-[#E8F876]/30"
                        : "border-slate-200"
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
                className="flex-1 py-2 text-xs font-bold text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleReportAndBlock}
                disabled={!reportReason}
                className="flex-1 py-2 rounded-xl bg-red-600 disabled:opacity-50 text-white text-xs font-bold"
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
