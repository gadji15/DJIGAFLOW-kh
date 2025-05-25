"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, Info, Loader2, Zap, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Real-time Status Indicator
export const StatusIndicator = ({
  status,
  label,
  className = "",
}: {
  status: "online" | "offline" | "loading" | "error"
  label?: string
  className?: string
}) => {
  const statusConfig = {
    online: { color: "bg-green-500", icon: CheckCircle, pulse: true },
    offline: { color: "bg-red-500", icon: AlertCircle, pulse: false },
    loading: { color: "bg-yellow-500", icon: Loader2, pulse: true },
    error: { color: "bg-red-500", icon: AlertCircle, pulse: true },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="relative">
        <div className={cn("w-3 h-3 rounded-full", config.color)} />
        {config.pulse && (
          <motion.div
            className={cn("absolute inset-0 rounded-full", config.color, "opacity-30")}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </div>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <Icon className={cn("w-4 h-4", status === "loading" && "animate-spin")} />
    </div>
  )
}

// Live Counter with Animation
export const LiveCounter = ({
  value,
  label,
  icon: Icon,
  trend,
  className = "",
}: {
  value: number
  label: string
  icon?: any
  trend?: "up" | "down" | "neutral"
  className?: string
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 60
    const increment = (value - displayValue) / steps
    const timer = setInterval(() => {
      setDisplayValue((prev) => {
        const next = prev + increment
        if ((increment > 0 && next >= value) || (increment < 0 && next <= value)) {
          clearInterval(timer)
          return value
        }
        return next
      })
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, displayValue])

  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-muted-foreground",
  }

  return (
    <motion.div
      className={cn("p-4 rounded-lg bg-card border", className)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.div
            className="text-2xl font-bold"
            key={Math.floor(displayValue)}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {Math.floor(displayValue).toLocaleString()}
          </motion.div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
        {Icon && (
          <div className={cn("p-2 rounded-full bg-primary/10", trend && trendColors[trend])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {trend && (
        <motion.div
          className={cn("flex items-center mt-2 text-sm", trendColors[trend])}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <TrendingUp className={cn("w-4 h-4 mr-1", trend === "down" && "rotate-180")} />
          <span>{trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} Tendance</span>
        </motion.div>
      )}
    </motion.div>
  )
}

// Real-time Activity Feed
export const ActivityFeed = ({ activities }: { activities: any[] }) => {
  const [visibleActivities, setVisibleActivities] = useState(activities.slice(0, 5))

  useEffect(() => {
    setVisibleActivities(activities.slice(0, 5))
  }, [activities])

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {visibleActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            layout
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: index * 0.1,
            }}
            className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="flex-1">
              <div className="text-sm font-medium">{activity.title}</div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
            <div className="text-xs text-primary font-medium">{activity.status}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Performance Metrics Dashboard
export const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    fps: 0,
    memory: 0,
  })

  useEffect(() => {
    // Simulate real-time metrics
    const interval = setInterval(() => {
      setMetrics({
        loadTime: Math.random() * 2 + 1,
        fps: Math.floor(Math.random() * 10) + 55,
        memory: Math.random() * 50 + 20,
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-3 gap-4">
      <LiveCounter
        value={metrics.loadTime}
        label="Load Time (s)"
        icon={Zap}
        trend={metrics.loadTime < 1.5 ? "up" : "down"}
      />
      <LiveCounter value={metrics.fps} label="FPS" icon={TrendingUp} trend={metrics.fps > 58 ? "up" : "down"} />
      <LiveCounter value={metrics.memory} label="Memory (MB)" icon={Info} trend={metrics.memory < 40 ? "up" : "down"} />
    </div>
  )
}

// Interactive Notification System
export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const { toast } = useToast()

  const addNotification = useCallback(
    (notification: any) => {
      setNotifications((prev) => [notification, ...prev.slice(0, 4)])
      toast({
        title: notification.title,
        description: notification.message,
      })
    },
    [toast],
  )

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const notifications = [
        { id: Date.now(), title: "Nouvelle commande", message: "Commande #1234 reçue", type: "success" },
        { id: Date.now(), title: "Stock faible", message: "Produit XYZ en rupture", type: "warning" },
        { id: Date.now(), title: "Synchronisation", message: "Données mises à jour", type: "info" },
      ]
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
      addNotification(randomNotification)
    }, 10000)

    return () => clearInterval(interval)
  }, [addNotification])

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="p-3 rounded-lg bg-card border shadow-sm"
          >
            <div className="font-medium text-sm">{notification.title}</div>
            <div className="text-xs text-muted-foreground">{notification.message}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
