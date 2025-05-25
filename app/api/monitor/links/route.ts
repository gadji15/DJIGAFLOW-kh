import { NextResponse } from "next/server"
import { AutomatedLinkChecker } from "@/lib/link-checker"

const linkChecker = new AutomatedLinkChecker()

export async function GET() {
  try {
    const status = linkChecker.getStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("Error getting link status:", error)
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const report = await linkChecker.runManualCheck()
    return NextResponse.json({
      success: true,
      report,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error running link check:", error)
    return NextResponse.json({ error: "Failed to run check" }, { status: 500 })
  }
}
