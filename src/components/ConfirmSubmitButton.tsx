"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ActionStatusModal } from "@/components/ActionStatusModal";

export function ConfirmSubmitButton({
  children,
  message,
  className,
  ariaLabel,
  pendingTitle = "กำลังดำเนินการ",
  pendingDescription = "ระบบกำลังบันทึกการเปลี่ยนแปลง กรุณารอสักครู่",
}: {
  children: ReactNode;
  message: string;
  className: string;
  ariaLabel?: string;
  pendingTitle?: string;
  pendingDescription?: string;
}) {
  const { pending } = useFormStatus();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <button
        className={className}
        type="button"
        aria-label={ariaLabel}
        disabled={pending}
        onClick={() => setConfirming(true)}
      >
        {children}
      </button>
      {confirming ? (
        <div className="action-modal-backdrop" role="dialog" aria-modal="true" aria-label="ยืนยันการดำเนินการ">
          <div className="action-modal confirm">
            <div>
              <h2>ยืนยันการดำเนินการ</h2>
              <p>{message}</p>
            </div>
            <div className="modal-actions">
              <button className="btn ghost" type="button" onClick={() => setConfirming(false)}>
                ยกเลิก
              </button>
              <button className="btn danger" type="submit" disabled={pending}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <ActionStatusModal open={pending} title={pendingTitle} description={pendingDescription} />
    </>
  );
}
