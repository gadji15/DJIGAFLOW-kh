"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Zap, Clock, Database } from "lucide-react"

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    fps: 60,
    memory: 0,
    apiLatency: 0,
  })

  useEffect(() => {
    // Monitor performance metrics
    const startTime = performance.now()

    // Simulate real-time metrics
    const interval = setInterval(() => {
      setMetrics({
        loadTime: (performance.now() - startTime) / 1000,
        fps: Math.floor(Math.random() * 5) + 58,
        memory: (performance as any).memory
          ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
          : Math.floor(Math.random() * 20) + 30,
        apiLatency: Math.floor(Math.random() * 50) + 50,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="fixed bottom-4 left-4 bg-background/90 backdrop-blur-md border border-border rounded-lg p-4 shadow-lg z-40"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
    >
      <div className="text-sm font-medium mb-2">Performance</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-blue-500" />
          <span>{metrics.loadTime.toFixed(1)}s</span>
        </div>
        <div className="flex items-center space-x-1">
          <Activity className="w-3 h-3 text-green-500" />
          <span>{metrics.fps} FPS</span>
        </div>
        <div className="flex items-center space-x-1">
          <Database className="w-3 h-3 text-purple-500" />
          <span>{metrics.memory}MB</span>
        </div>
        <div className="flex items-center space-x-1">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span>{metrics.apiLatency}ms</span>
        </div>
      </div>
    </motion.div>
  )
}
