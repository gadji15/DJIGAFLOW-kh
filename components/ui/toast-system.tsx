"use client"

import * as React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info" | "loading"
export type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  persistent?: boolean
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  loading: (message: string, title?: string) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
}

const toastStyles = {
  success: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200",
  error: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200",
  warning:
    "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200",
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200",
  loading: "border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-200",
}

function ToastComponent({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(100)
  const Icon = toastIcons[toast.type]

  React.useEffect(() => {
    if (toast.persistent || isHovered) return

    const duration = toast.duration || 5000
    const interval = 50
    const decrement = (interval / duration) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          onRemove(toast.id)
          return 0
        }
        return prev - decrement
      })
    }, interval)

    return () => clearInterval(timer)
  }, [toast.id, toast.duration, toast.persistent, isHovered, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-sm max-w-sm w-full",
        toastStyles[toast.type],
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", toast.type === "loading" && "animate-spin")} />
        <div className="flex-1 min-w-0">
          {toast.title && <div className="font-semibold text-sm mb-1">{toast.title}</div>}
          <div className="text-sm leading-relaxed">{toast.message}</div>
          {toast.action && (
            <button onClick={toast.action.onClick} className="mt-2 text-sm font-medium underline hover:no-underline">
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {!toast.persistent && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-30 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      )}
    </motion.div>
  )
}

interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastPosition
  maxToasts?: number
}

export function ToastProvider({ children, position = "top-right", maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9)
      setToasts((prev) => {
        const newToasts = [{ ...toast, id }, ...prev]
        return newToasts.slice(0, maxToasts)
      })
    },
    [maxToasts],
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "success", message, title })
    },
    [addToast],
  )

  const error = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "error", message, title })
    },
    [addToast],
  )

  const warning = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "warning", message, title })
    },
    [addToast],
  )

  const info = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "info", message, title })
    },
    [addToast],
  )

  const loading = useCallback(
    (message: string, title?: string) => {
      addToast({ type: "loading", message, title, persistent: true })
    },
    [addToast],
  )

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4"
      case "top-left":
        return "top-4 left-4"
      case "bottom-right":
        return "bottom-4 right-4"
      case "bottom-left":
        return "bottom-4 left-4"
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2"
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2"
      default:
        return "top-4 right-4"
    }
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info, loading }}>
      {children}
      <div className={cn("fixed z-50 flex flex-col gap-2", getPositionClasses())}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
