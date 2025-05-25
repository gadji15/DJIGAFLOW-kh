import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  sender_type: "user" | "support"
  message: string
  message_type: "text" | "image" | "file"
  created_at: string
  read_at?: string
}

export interface Conversation {
  id: string
  user_id: string
  support_agent_id?: string
  status: "open" | "closed" | "pending"
  priority: "low" | "medium" | "high"
  subject: string
  created_at: string
  updated_at: string
}

export class ChatService {
  private supabase = createClientComponentClient()
  private channel: RealtimeChannel | null = null

  async createConversation(userId: string, subject: string): Promise<Conversation> {
    const { data, error } = await this.supabase
      .from("conversations")
      .insert({
        user_id: userId,
        subject,
        status: "open",
        priority: "medium",
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    senderType: "user" | "support",
    message: string,
    messageType: "text" | "image" | "file" = "text",
  ): Promise<ChatMessage> {
    const { data, error } = await this.supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        sender_type: senderType,
        message,
        message_type: messageType,
      })
      .select()
      .single()

    if (error) throw error

    // Mettre à jour la conversation
    await this.supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId)

    return data
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const { data, error } = await this.supabase
      .from("chat_messages")
      .select(`
        *,
        sender:users(id, first_name, last_name, avatar_url)
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data || []
  }

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await this.supabase
      .from("chat_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .is("read_at", null)
  }

  subscribeToConversation(conversationId: string, onMessage: (message: ChatMessage) => void): void {
    this.channel = this.supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          onMessage(payload.new as ChatMessage)
        },
      )
      .subscribe()
  }

  unsubscribe(): void {
    if (this.channel) {
      this.supabase.removeChannel(this.channel)
      this.channel = null
    }
  }
}
