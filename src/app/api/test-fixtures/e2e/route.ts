import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { e2eFixturesEnabled } from "@/lib/attachment-fixtures";
import { resetE2EFixtures } from "@/lib/db";

export async function POST() {
  await requireAuth();

  if (!e2eFixturesEnabled()) {
    return NextResponse.json({ ok: false, error: "E2E fixtures are disabled" }, { status: 404 });
  }

  await resetE2EFixtures();
  return NextResponse.json({
    ok: true,
    requestNo: "C69-0003",
    attachment: "test-private.pdf",
  });
}
