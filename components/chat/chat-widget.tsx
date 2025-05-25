"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react"
import { ChatService, type ChatMessage, type Conversation } from "@/lib/chat/chat-service"
import { useAuth } from "@/components/auth-provider"
import { motion, AnimatePresence } from "framer-motion"

export function ChatWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatService = new ChatService()

  useEffect(() => {
    if (conversation) {
      loadMessages()
      chatService.subscribeToConversation(conversation.id, handleNewMessage)

      return () => {
        chatService.unsubscribe()
      }
    }
  }, [conversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadMessages = async () => {
    if (!conversation) return

    try {
      const msgs = await chatService.getMessages(conversation.id)
      setMessages(msgs)

      if (user) {
        await chatService.markAsRead(conversation.id, user.id)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error)
    }
  }

  const handleNewMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message])

    if (user && message.sender_id !== user.id) {
      setUnreadCount((prev) => prev + 1)
    }
  }

  const startConversation = async () => {
    if (!user) return

    try {
      const conv = await chatService.createConversation(user.id, "Support général")
      setConversation(conv)
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation || !user) return

    try {
      await chatService.sendMessage(conversation.id, user.id, "user", newMessage.trim())
      setNewMessage("")
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const openChat = () => {
    setIsOpen(true)
    setUnreadCount(0)
    if (!conversation && user) {
      startConversation()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button onClick={openChat} className="h-14 w-14 rounded-full shadow-lg relative" size="icon">
              <MessageCircle className="h-6 w-6" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-80 h-96"
          >
            <Card className="h-full flex flex-col shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Support Client</CardTitle>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => setIsMinimized(!isMinimized)} className="h-6 w-6">
                    {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground text-sm">
                        Bonjour ! Comment pouvons-nous vous aider ?
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender_type === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-2 rounded-lg text-sm ${
                              message.sender_type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {message.message}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Tapez votre message..."
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
