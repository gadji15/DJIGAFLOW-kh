import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SERVICE_ROLE_KEY as string)

export async function POST(req: NextRequest) {
  try {
    const { userId, email, firstName, lastName, phone } = await req.json()

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upsert into profiles table (id as auth user id)
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          email,
          first_name: firstName || null,
          last_name: lastName || null,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 })
  }
}