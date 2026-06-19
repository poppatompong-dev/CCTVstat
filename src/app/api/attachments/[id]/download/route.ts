import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { e2eFixturesEnabled, fixturePdfBody, isFixtureBlobUrl } from "@/lib/attachment-fixtures";
import { getAttachment } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAuth();
  const { id } = await params;
  const attachment = await getAttachment(Number(id));
  if (!attachment) return new NextResponse("Not found", { status: 404 });

  if (e2eFixturesEnabled() && isFixtureBlobUrl(attachment.blob_url)) {
    return new NextResponse(fixturePdfBody(), {
      headers: {
        "content-disposition": `attachment; filename="${attachment.original_file_name}"`,
        "content-type": attachment.content_type || "application/pdf",
      },
    });
  }

  const url = attachment.download_url || attachment.blob_url;
  return NextResponse.redirect(url);
}
