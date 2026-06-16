import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getAttachment } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAuth();
  const { id } = await params;
  const attachment = await getAttachment(Number(id));
  if (!attachment) return new NextResponse("Not found", { status: 404 });

  const url = attachment.download_url || attachment.blob_url;
  return NextResponse.redirect(url);
}
