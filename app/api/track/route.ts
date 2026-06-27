import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const { type } = await req.json()

  const { error } = await supabase
    .from("events")
    .insert({ event_type: type })

  if (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}