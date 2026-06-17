"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="btn outline"
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
    >
      <Copy size={17} aria-hidden="true" />
      {copied ? "คัดลอกแล้ว" : "คัดลอกเลข"}
    </button>
  );
}
