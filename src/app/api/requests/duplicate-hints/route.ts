import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { findDuplicateHints } from "@/lib/db";
import { perfLog, perfStart, timed } from "@/lib/perf";

export async function GET(request: Request) {
  const routeStart = perfStart();
  try {
    await timed("/api/requests/duplicate-hints requireAuth", () => requireAuth());
    const params = new URL(request.url).searchParams;
    const requestDate = params.get("requestDate") || "";
    const categoryId = Number(params.get("categoryId") || 0);
    const locationText = params.get("locationText") || "";
    const rows = await timed("/api/requests/duplicate-hints findDuplicateHints", () =>
      findDuplicateHints({ requestDate, categoryId, locationText }),
    );
    return NextResponse.json({
      rows: rows.map((row) => ({
        id: row.id,
        requestNo: row.request_no,
        status: row.status_name,
        location: row.location_text,
      })),
    });
  } finally {
    perfLog("/api/requests/duplicate-hints total", routeStart);
  }
}
