"use client"

import type React from "react"

interface LogLevel {
  ERROR: "error"
  WARN: "warn"
  INFO: "info"
  DEBUG: "debug"
}

interface LogEntry {
  id: string
  timestamp: Date
  level: keyof LogLevel
  category: string
  action: string
  user_id?: string
  user_email?: string
  message: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  url?: string
  stack_trace?: string
}

interface LogFilter {
  level?: string[]
  category?: string[]
  userId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

class AdminLogger {
  private static instance: AdminLogger
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private sessionId: string
  private userId?: string
  private userEmail?: string
  private userRole?: string
  private isAdmin = false
  private logQueue: LogEntry[] = []
  private isOnline = true

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeLogger()
  }

  static getInstance(): AdminLogger {
    if (!AdminLogger.instance) {
      AdminLogger.instance = new AdminLogger()
    }
    return AdminLogger.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeLogger() {
    if (typeof window !== "undefined") {
      // Monitor online/offline status
      this.isOnline = navigator.onLine

      window.addEventListener("online", () => {
        this.isOnline = true
        this.log("INFO", "connection", "online", { message: "Connection restored" })
        this.flushLogQueue()
      })

      window.addEventListener("offline", () => {
        this.isOnline = false
        this.log("WARN", "connection", "offline", { message: "Connection lost" })
      })

      // Monitor page visibility
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.log("INFO", "navigation", "page_hidden", { message: "Page became hidden" })
        } else {
          this.log("INFO", "navigation", "page_visible", { message: "Page became visible" })
        }
      })

      // Monitor errors
      window.addEventListener("error", (event) => {
        adminLogger.error(
          "GLOBAL",
          "javascript_error",
          `Uncaught error: ${event.message}`,
          {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
          event.error,
        )
      })

      // Monitor unhandled promise rejections
      window.addEventListener("unhandledrejection", (event) => {
        adminLogger.error("GLOBAL", "promise_rejection", `Unhandled promise rejection: ${event.reason}`, {
          reason: event.reason,
        })
      })

      // Flush logs before page unload
      window.addEventListener("beforeunload", () => {
        this.flushLogQueue()
      })

      // Periodic log flushing
      setInterval(() => {
        if (this.logQueue.length > 0) {
          this.flushLogQueue()
        }
      }, 5000)
    }
  }

  private async getCurrentUser() {
    try {
      // In a real app, get from auth context
      return {
        id: "admin_user",
        email: "admin@djigaflow.com",
      }
    } catch {
      return null
    }
  }

  private async createLogEntry(
    level: keyof LogLevel,
    category: string,
    action: string,
    message: string,
    details?: Record<string, any>,
    error?: Error,
  ): Promise<LogEntry> {
    const user = await this.getCurrentUser()

    return {
      id: this.generateId(),
      timestamp: new Date(),
      level,
      category,
      action,
      user_id: user?.id,
      user_email: user?.email,
      message,
      details,
      ip_address: typeof window !== "undefined" ? "client" : "server",
      user_agent: typeof window !== "undefined" ? navigator.userAgent : "server",
      url: typeof window !== "undefined" ? window.location.href : undefined,
      stack_trace: error?.stack,
    }
  }

  // Set user context for logging
  setUserContext(userId: string, email: string, role: string) {
    this.userId = userId
    this.userEmail = email
    this.userRole = role
    this.isAdmin = role === "admin" || role === "super_admin"

    this.log("INFO", "auth", "user_context_set", {
      userId,
      email,
      role,
      isAdmin: this.isAdmin,
    })
  }

  // Clear user context on logout
  clearUserContext() {
    this.log("INFO", "auth", "user_logout", {
      userId: this.userId,
      email: this.userEmail,
    })

    this.userId = undefined
    this.userEmail = undefined
    this.userRole = undefined
    this.isAdmin = false
  }

  async log(
    level: keyof LogLevel,
    category: string,
    action: string,
    message: string,
    details?: Record<string, any>,
    error?: Error,
  ) {
    const logEntry = await this.createLogEntry(level, category, action, message, details, error)

    // Add to memory store
    this.logs.unshift(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Console output with styling
    const timestamp = logEntry.timestamp.toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${category}]`

    switch (level) {
      case "ERROR":
        console.error(`🔴 ${prefix}`, message, details, error)
        break
      case "WARN":
        console.warn(`🟡 ${prefix}`, message, details)
        break
      case "INFO":
        console.info(`🔵 ${prefix}`, message, details)
        break
      case "DEBUG":
        console.debug(`⚪ ${prefix}`, message, details)
        break
    }

    // Send to server in production
    if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
      try {
        await fetch("/api/admin/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(logEntry),
        })
      } catch (err) {
        console.error("Failed to send log to server:", err)
      }
    }
  }

  // Convenience methods
  async error(category: string, action: string, message: string, details?: Record<string, any>, error?: Error) {
    return this.log("ERROR", category, action, message, details, error)
  }

  async warn(category: string, action: string, message: string, details?: Record<string, any>) {
    return this.log("WARN", category, action, message, details)
  }

  async info(category: string, action: string, message: string, details?: Record<string, any>) {
    return this.log("INFO", category, action, message, details)
  }

  async debug(category: string, action: string, message: string, details?: Record<string, any>) {
    return this.log("DEBUG", category, action, message, details)
  }

  // Specific logging methods for common actions
  async logFormSubmit(formName: string, success: boolean, data?: any, error?: Error) {
    const level = success ? "INFO" : "ERROR"
    const action = success ? "form_submit_success" : "form_submit_error"
    const message = `Form ${formName} ${success ? "submitted successfully" : "failed to submit"}`

    return this.log(level, "FORM", action, message, { formName, data }, error)
  }

  async logButtonClick(buttonName: string, context?: string, data?: any) {
    return this.log("INFO", "UI", "button_click", `Button clicked: ${buttonName}`, {
      buttonName,
      context,
      data,
    })
  }

  async logNavigation(from: string, to: string, method: "click" | "programmatic" = "click") {
    return this.log("INFO", "NAVIGATION", "page_change", `Navigation from ${from} to ${to}`, {
      from,
      to,
      method,
    })
  }

  async logConnection(
    type: "database" | "api" | "websocket",
    status: "connected" | "disconnected" | "error",
    details?: any,
  ) {
    const level = status === "error" ? "ERROR" : "INFO"
    return this.log(level, "CONNECTION", `${type}_${status}`, `${type} ${status}`, details)
  }

  async logUserAction(action: string, target: string, success: boolean, details?: any, error?: Error) {
    const level = success ? "INFO" : "ERROR"
    return this.log(level, "USER_ACTION", action, `User ${action} ${target}`, details, error)
  }

  // Get logs for admin interface
  getLogs(filters?: {
    level?: keyof LogLevel
    category?: string
    startDate?: Date
    endDate?: Date
    limit?: number
  }): LogEntry[] {
    let filteredLogs = [...this.logs]

    if (filters?.level) {
      filteredLogs = filteredLogs.filter((log) => log.level === filters.level)
    }

    if (filters?.category) {
      filteredLogs = filteredLogs.filter((log) => log.category === filters.category)
    }

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp >= filters.startDate!)
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp <= filters.endDate!)
    }

    if (filters?.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit)
    }

    return filteredLogs
  }

  clearLogs() {
    this.logs = []
    console.info("🧹 Admin logs cleared")
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  private async flushLogQueue() {
    if (this.logQueue.length === 0 || !this.isOnline) return

    const logsToSend = [...this.logQueue]
    this.logQueue = []

    try {
      await fetch("/api/admin/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logs: logsToSend }),
        keepalive: true,
      })
    } catch (error) {
      // Re-queue logs if sending failed
      this.logQueue.unshift(...logsToSend)
      console.error("Failed to send logs to server:", error)
    }
  }
}

export const adminLogger = AdminLogger.getInstance()

// React hook for using the logger
import { useEffect } from "react"

export function useAdminLogger() {
  useEffect(() => {
    // Log component mount
    adminLogger.logDebug("component", "mount", {
      component: "useAdminLogger",
    })

    return () => {
      // Log component unmount
      adminLogger.logDebug("component", "unmount", {
        component: "useAdminLogger",
      })
    }
  }, [])

  return adminLogger
}

// Higher-order component for automatic logging
export function withAdminLogging<T extends Record<string, any>>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string,
) {
  return function LoggedComponent(props: T) {
    const logger = useAdminLogger()

    useEffect(() => {
      logger.logDebug("component", "render", {
        component: componentName,
        props: Object.keys(props),
      })
    }, [logger, props])

    return <WrappedComponent {...props} />
  }
}
