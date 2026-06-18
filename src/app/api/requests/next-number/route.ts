import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { nextRequestNumber } from "@/lib/db";
import { perfLog, perfStart, timed } from "@/lib/perf";

export async function GET(request: Request) {
  const routeStart = perfStart();
  try {
    await timed("/api/requests/next-number requireAuth", () => requireAuth());
    const date = new URL(request.url).searchParams.get("date");
    if (!date) {
      return NextResponse.json({ error: "missing date" }, { status: 400 });
    }
    const next = await timed("/api/requests/next-number nextRequestNumber", () =>
      nextRequestNumber(date),
    );
    return NextResponse.json(next);
  } finally {
    perfLog("/api/requests/next-number total", routeStart);
  }
}
