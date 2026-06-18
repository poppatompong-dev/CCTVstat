"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ActionStatusModal } from "@/components/ActionStatusModal";

export function SubmitButton({
  children,
  pendingLabel = "กำลังบันทึก...",
  className = "btn primary",
  modalTitle = "กำลังดำเนินการ",
  modalDescription = "ระบบกำลังบันทึกข้อมูล กรุณารอสักครู่",
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
  modalTitle?: string;
  modalDescription?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      <button className={className} type="submit" disabled={pending} aria-busy={pending}>
        {pending ? pendingLabel : children}
      </button>
      <ActionStatusModal open={pending} title={modalTitle} description={modalDescription} />
    </>
  );
}
