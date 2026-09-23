import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const usernamePattern = /^[A-Za-z0-9]{1,16}$/;

export async function GET(request: NextRequest) {
  try {
    const value = request.nextUrl.searchParams.get("value")?.trim() ?? "";
    if (!usernamePattern.test(value)) {
      return NextResponse.json({ error: "invalid_username" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("is_username_available", { candidate: value });
    if (error) {
      console.error("api/username: availability check error", error);
      return NextResponse.json({ error: "availability_check_unavailable" }, { status: 503 });
    }
    return NextResponse.json(
      { available: Boolean(data) },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("api/username: unexpected error", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
