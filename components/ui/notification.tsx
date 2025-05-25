"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationProps {
  type: NotificationType
  title: string
  message: string
  duration?: number
  onClose?: () => void
  isVisible?: boolean
}

export function Notification({ type, title, message, duration = 5000, onClose, isVisible = true }: NotificationProps) {
  const [isShown, setIsShown] = useState(isVisible)

  useEffect(() => {
    setIsShown(isVisible)
  }, [isVisible])

  useEffect(() => {
    if (isShown && duration > 0) {
      const timer = setTimeout(() => {
        setIsShown(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isShown, duration, onClose])

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  }

  const bgColors = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
    warning: "bg-amber-50 border-amber-200",
  }

  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn("fixed top-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-lg", bgColors[type])}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">{icons[type]}</div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium">{title}</h3>
              <div className="mt-1 text-sm text-gray-600">{message}</div>
            </div>
            <button
              type="button"
              className="ml-4 inline-flex flex-shrink-0 rounded-md p-1 text-gray-400 hover:bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => {
                setIsShown(false)
                onClose?.()
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Context and hook for global notifications
import { createContext, useContext, type ReactNode } from "react"

interface NotificationContextType {
  showNotification: (props: Omit<NotificationProps, "isVisible" | "onClose">) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<(NotificationProps & { id: string })[]>([])

  const showNotification = (props: Omit<NotificationProps, "isVisible" | "onClose">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setNotifications((prev) => [...prev, { ...props, id, isVisible: true }])
  }

  const handleClose = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <Notification key={notification.id} {...notification} onClose={() => handleClose(notification.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
