import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { class_schedule_id } = await req.json();

    // 1. Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Check if user already has a registration
    const { data: existing, error: existingError } = await supabase
      .from("class_registrations")
      .select("id,status")
      .eq("class_schedule_id", class_schedule_id)
      .eq("user_profile_id", user.id)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 400 });
    }
    if (existing) {
      return NextResponse.json(
        { error: "Already registered", status: existing.status },
        { status: 400 }
      );
    }

    // 3. Count how many are confirmed
    const { count: confirmedCount, error: confError } = await supabase
      .from("class_registrations")
      .select("*", { count: "exact" })
      .eq("class_schedule_id", class_schedule_id)
      .eq("status", "confirmed");

    if (confError) {
      return NextResponse.json({ error: confError.message }, { status: 400 });
    }

    // 4. Check schedule's max_participants
    const { data: scheduleData, error: scheduleError } = await supabase
      .from("class_schedules")
      .select("max_participants")
      .eq("id", class_schedule_id)
      .maybeSingle();

    if (scheduleError || !scheduleData) {
      return NextResponse.json(
        { error: "Unable to fetch schedule data" },
        { status: 400 }
      );
    }

    const confirmed = confirmedCount || 0;
    const status =
      confirmed < scheduleData.max_participants ? "confirmed" : "waitlisted";

    // 5. Insert
    const { error: insertError } = await supabase.from("class_registrations").insert({
      class_schedule_id,
      user_profile_id: user.id,
      registration_date: new Date().toISOString(),
      status,
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to register: " + insertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ status }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
