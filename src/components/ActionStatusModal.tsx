"use client";

import { LoaderCircle } from "lucide-react";

export function ActionStatusModal({
  open,
  title,
  description,
}: {
  open: boolean;
  title: string;
  description: string;
}) {
  if (!open) return null;

  return (
    <div className="action-modal-backdrop" role="status" aria-live="polite">
      <div className="action-modal">
        <LoaderCircle className="spin" size={28} aria-hidden="true" />
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
