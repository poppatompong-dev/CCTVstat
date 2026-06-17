import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { nextRequestNumber } from "@/lib/db";

export async function GET(request: Request) {
  await requireAuth();
  const date = new URL(request.url).searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "missing date" }, { status: 400 });
  }
  const next = await nextRequestNumber(date);
  return NextResponse.json(next);
}
