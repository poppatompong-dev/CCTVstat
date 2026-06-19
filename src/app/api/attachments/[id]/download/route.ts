import { get, getDownloadUrl } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { e2eFixturesEnabled, fixturePdfBody, isFixtureBlobUrl } from "@/lib/attachment-fixtures";
import { getAttachment } from "@/lib/db";

function contentDisposition(disposition: "inline" | "attachment", fileName: string) {
  return `${disposition}; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAuth();
  const { id } = await params;
  const attachment = await getAttachment(Number(id));
  if (!attachment) return new NextResponse("Not found", { status: 404 });
  const url = new URL(request.url);
  const disposition = url.searchParams.get("disposition") === "inline" ? "inline" : "attachment";

  if (e2eFixturesEnabled() && isFixtureBlobUrl(attachment.blob_url)) {
    return new NextResponse(fixturePdfBody(), {
      headers: {
        "content-disposition": contentDisposition(disposition, attachment.original_file_name),
        "content-type": attachment.content_type || "application/pdf",
      },
    });
  }

  if (disposition === "attachment") {
    return NextResponse.redirect(attachment.download_url || getDownloadUrl(attachment.blob_url));
  }

  const result = await get(attachment.blob_pathname || attachment.blob_url, { access: "private" });
  if (!result?.stream) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(result.stream, {
    headers: {
      "cache-control": "private, max-age=300",
      "content-disposition": contentDisposition("inline", attachment.original_file_name),
      "content-length": String(result.blob.size),
      "content-type": result.blob.contentType || attachment.content_type || "application/octet-stream",
    },
  });
}
