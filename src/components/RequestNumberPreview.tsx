"use client";

import { useEffect, useState } from "react";

export function RequestNumberPreview({ initialDate }: { initialDate: string }) {
  const [date, setDate] = useState(initialDate);
  const [requestNo, setRequestNo] = useState<string>("");

  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>('input[name="request_date"]');
    if (!input) return;
    const onInput = () => setDate(input.value);
    input.addEventListener("input", onInput);
    input.addEventListener("change", onInput);
    return () => {
      input.removeEventListener("input", onInput);
      input.removeEventListener("change", onInput);
    };
  }, []);

  useEffect(() => {
    if (!date) return;
    const controller = new AbortController();
    fetch(`/api/requests/next-number?date=${encodeURIComponent(date)}`, {
      signal: controller.signal,
    })
      .then((response) => response.ok ? response.json() : null)
      .then((data: { requestNo?: string } | null) => {
        if (data?.requestNo) setRequestNo(data.requestNo);
      })
      .catch(() => undefined)
    return () => controller.abort();
  }, [date]);

  return (
    <div className="number-preview">
      <span>เลขคำร้องโดยประมาณ</span>
      <strong className="mono">{requestNo || "กำลังคำนวณ..."}</strong>
      <p>เลขจริงออกเมื่อบันทึก เพื่อกันกรณีมีผู้บันทึกพร้อมกัน</p>
    </div>
  );
}
