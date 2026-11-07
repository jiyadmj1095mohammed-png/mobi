"use client";

import { supabase, isSupabaseConfigured } from "./supabase";
import { ChatSession, EphemeralMessage } from "@/types/database";

export interface PeerUser {
  id: string;
  name: string;
  dept: string;
}

export type PeerMatchCallback = (session: ChatSession) => void;

/**
 * Realtime Campus Matchmaker
 * Uses Supabase Realtime across devices + BroadcastChannel across local tabs.
 * NO AI bots. Matches only real human peers.
 */
export class PeerMatchmaker {
  private currentUser: PeerUser;
  private channel: BroadcastChannel | null = null;
  private supabaseSubscription: any = null;
  private activeRoomId: string | null = null;
  private isSearching = false;

  constructor(currentUser: PeerUser) {
    this.currentUser = currentUser;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel("mobi_campus_matchmaking_bus");
    }
  }

  public async findPeer(onMatched: PeerMatchCallback, onStatus: (msg: string) => void) {
    this.isSearching = true;
    onStatus("Looking for an available campus peer...");

    // 1. Cross-tab Local Broadcast Engine (Allows instantaneous testing across 2 tabs)
    if (this.channel) {
      this.channel.onmessage = (event) => {
        if (!this.isSearching) return;
        const data = event.data;

        // Another tab is looking for a peer!
        if (data.type === "PEER_WAITING" && data.user.id !== this.currentUser.id) {
          const roomId = `room-${Date.now()}`;
          const session: ChatSession = {
            id: roomId,
            participantA: data.user.id,
            participantAName: data.user.name,
            participantADept: data.user.dept,
            participantB: this.currentUser.id,
            participantBName: this.currentUser.name,
            participantBDept: this.currentUser.dept,
            status: "active",
            createdAt: new Date().toISOString(),
          };

          // Confirm match to the waiting peer
          this.channel?.postMessage({
            type: "MATCH_ACCEPTED",
            targetUserId: data.user.id,
            session,
          });

          this.isSearching = false;
          onMatched(session);
        } else if (data.type === "MATCH_ACCEPTED" && data.targetUserId === this.currentUser.id) {
          this.isSearching = false;
          onMatched(data.session);
        }
      };

      // Announce presence to other open tabs
      this.channel.postMessage({
        type: "PEER_WAITING",
        user: this.currentUser,
      });
    }

    // 2. Supabase Realtime Engine (Allows cross-device and remote campus matching)
    if (isSupabaseConfigured) {
      try {
        // Look for an existing waiting room
        const { data: waitingRooms } = await supabase
          .from("chat_rooms")
          .select("*")
          .eq("status", "waiting")
          .neq("participant_a_id", this.currentUser.id)
          .order("created_at", { ascending: true })
          .limit(1);

        if (waitingRooms && waitingRooms.length > 0) {
          const room = waitingRooms[0];
          // Join this room
          const { error: updateError } = await supabase
            .from("chat_rooms")
            .update({
              status: "active",
              participant_b_id: this.currentUser.id,
              participant_b_name: this.currentUser.name,
              participant_b_dept: this.currentUser.dept,
            })
            .eq("id", room.id);

          if (!updateError) {
            const session: ChatSession = {
              id: room.id,
              participantA: room.participant_a_id,
              participantAName: room.participant_a_name,
              participantADept: room.participant_a_dept,
              participantB: this.currentUser.id,
              participantBName: this.currentUser.name,
              participantBDept: this.currentUser.dept,
              status: "active",
              createdAt: new Date().toISOString(),
            };
            this.isSearching = false;
            onMatched(session);
            return;
          }
        }

        // No waiting room found -> Create a waiting room and wait for opponent to join
        const roomCode = `room-${Date.now()}`;
        const { data: createdRoom, error: createError } = await supabase
          .from("chat_rooms")
          .insert({
            room_code: roomCode,
            status: "waiting",
            participant_a_id: this.currentUser.id,
            participant_a_name: this.currentUser.name,
            participant_a_dept: this.currentUser.dept,
          })
          .select()
          .single();

        if (createdRoom && !createError) {
          this.activeRoomId = createdRoom.id;
          onStatus("Waiting for a peer to join your room...");

          // Listen for an opponent joining this specific room
          this.supabaseSubscription = supabase
            .channel(`room_match_${createdRoom.id}`)
            .on(
              "postgres_changes",
              {
                event: "UPDATE",
                schema: "public",
                table: "chat_rooms",
                filter: `id=eq.${createdRoom.id}`,
              },
              (payload: any) => {
                const updated = payload.new;
                if (updated && updated.status === "active" && updated.participant_b_id) {
                  const session: ChatSession = {
                    id: updated.id,
                    participantA: updated.participant_a_id,
                    participantAName: updated.participant_a_name,
                    participantADept: updated.participant_a_dept,
                    participantB: updated.participant_b_id,
                    participantBName: updated.participant_b_name,
                    participantBDept: updated.participant_b_dept,
                    status: "active",
                    createdAt: new Date().toISOString(),
                  };
                  this.isSearching = false;
                  onMatched(session);
                }
              }
            )
            .subscribe();
        }
      } catch (err) {
        console.warn("Supabase matchmaking fallback:", err);
      }
    }
  }

  public cancelSearch() {
    this.isSearching = false;
    if (this.supabaseSubscription) {
      supabase.removeChannel(this.supabaseSubscription);
      this.supabaseSubscription = null;
    }
    if (this.activeRoomId && isSupabaseConfigured) {
      supabase
        .from("chat_rooms")
        .update({ status: "closed" })
        .eq("id", this.activeRoomId)
        .then(() => {});
    }
  }

  public destroy() {
    this.cancelSearch();
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}
