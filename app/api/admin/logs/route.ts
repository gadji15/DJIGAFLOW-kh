import { type NextRequest, NextResponse } from "next/server"

interface LogEntry {
  id: string
  timestamp: Date
  level: "ERROR" | "WARN" | "INFO" | "DEBUG"
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

// In-memory storage for demo purposes
// In production, use a proper database
let logs: LogEntry[] = []

export async function POST(request: NextRequest) {
  try {
    const logEntry: LogEntry = await request.json()

    // Validate log entry
    if (!logEntry.id || !logEntry.timestamp || !logEntry.level || !logEntry.message) {
      return NextResponse.json({ success: false, error: "Invalid log entry" }, { status: 400 })
    }

    // Add client IP if not provided
    if (!logEntry.ip_address) {
      logEntry.ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    }

    // Add to logs
    logs.unshift(logEntry)

    // Keep only last 10000 logs to prevent memory issues
    if (logs.length > 10000) {
      logs = logs.slice(0, 10000)
    }

    // In production, save to database here
    console.log(`[${logEntry.level}] ${logEntry.category}:${logEntry.action} - ${logEntry.message}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving log:", error)
    return NextResponse.json({ success: false, error: "Failed to save log" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get("level")
    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    let filteredLogs = [...logs]

    // Apply filters
    if (level && level !== "all") {
      filteredLogs = filteredLogs.filter((log) => log.level === level)
    }

    if (category && category !== "all") {
      filteredLogs = filteredLogs.filter((log) => log.category === category)
    }

    if (startDate) {
      const start = new Date(startDate)
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= start)
    }

    if (endDate) {
      const end = new Date(endDate)
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) <= end)
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply limit
    filteredLogs = filteredLogs.slice(0, limit)

    return NextResponse.json({
      success: true,
      logs: filteredLogs,
      total: logs.length,
      filtered: filteredLogs.length,
    })
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch logs" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    logs = []
    return NextResponse.json({ success: true, message: "All logs cleared" })
  } catch (error) {
    console.error("Error clearing logs:", error)
    return NextResponse.json({ success: false, error: "Failed to clear logs" }, { status: 500 })
  }
}
