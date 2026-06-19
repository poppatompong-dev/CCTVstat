import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getLocationSuggestions, getSmartDefaults } from "@/lib/db";
import { perfLog, perfStart, timed } from "@/lib/perf";

export async function GET() {
  const routeStart = perfStart();
  try {
    await timed("/api/requests/form-assist requireAuth", () => requireAuth());
    const [smartDefaults, locationSuggestions] = await Promise.all([
      timed("/api/requests/form-assist getSmartDefaults", () => getSmartDefaults()),
      timed("/api/requests/form-assist getLocationSuggestions", () => getLocationSuggestions()),
    ]);

    return NextResponse.json({ smartDefaults, locationSuggestions });
  } finally {
    perfLog("/api/requests/form-assist total", routeStart);
  }
}
