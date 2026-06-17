import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { findDuplicateHints } from "@/lib/db";

export async function GET(request: Request) {
  await requireAuth();
  const params = new URL(request.url).searchParams;
  const requestDate = params.get("requestDate") || "";
  const categoryId = Number(params.get("categoryId") || 0);
  const locationText = params.get("locationText") || "";
  const rows = await findDuplicateHints({ requestDate, categoryId, locationText });
  return NextResponse.json({
    rows: rows.map((row) => ({
      id: row.id,
      requestNo: row.request_no,
      status: row.status_name,
      location: row.location_text,
    })),
  });
}
