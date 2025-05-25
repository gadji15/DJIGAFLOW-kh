import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { report, timestamp } = await request.json()

    // Save broken links report to database
    const { error } = await supabaseAdmin.from("broken_links_reports").insert({
      report,
      timestamp,
      status: "pending",
    })

    if (error) {
      console.error("Error saving broken links report:", error)
      return NextResponse.json({ error: "Failed to save report" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in broken links API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("broken_links_reports")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching broken links reports:", error)
      return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
    }

    return NextResponse.json({ reports: data })
  } catch (error) {
    console.error("Error in broken links API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
