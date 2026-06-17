"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HintRow = {
  id: number;
  requestNo: string;
  status: string;
  location: string | null;
};

export function DuplicateHint() {
  const [rows, setRows] = useState<HintRow[]>([]);

  useEffect(() => {
    const dateInput = document.querySelector<HTMLInputElement>('input[name="request_date"]');
    const categoryInput = document.querySelector<HTMLSelectElement>('select[name="category_id"]');
    const locationInput = document.querySelector<HTMLInputElement>('input[name="location_text"]');
    if (!dateInput || !categoryInput || !locationInput) return;

    let timer: number | null = null;
    let controller: AbortController | null = null;

    const run = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const requestDate = dateInput.value;
        const categoryId = categoryInput.value;
        const locationText = locationInput.value.trim();
        if (!requestDate || !categoryId || locationText.length < 2) {
          setRows([]);
          return;
        }

        controller?.abort();
        controller = new AbortController();
        const params = new URLSearchParams({ requestDate, categoryId, locationText });
        fetch(`/api/requests/duplicate-hints?${params.toString()}`, {
          signal: controller.signal,
        })
          .then((response) => response.ok ? response.json() : null)
          .then((data: { rows?: HintRow[] } | null) => setRows(data?.rows ?? []))
          .catch(() => undefined);
      }, 320);
    };

    dateInput.addEventListener("change", run);
    categoryInput.addEventListener("change", run);
    locationInput.addEventListener("input", run);
    run();

    return () => {
      if (timer) window.clearTimeout(timer);
      controller?.abort();
      dateInput.removeEventListener("change", run);
      categoryInput.removeEventListener("change", run);
      locationInput.removeEventListener("input", run);
    };
  }, []);

  if (!rows.length) return null;

  return (
    <aside className="hint-box">
      <strong>มีคำร้องคล้ายกันวันนี้</strong>
      <p>ตรวจสอบก่อนบันทึกได้ แต่ระบบไม่บังคับและไม่ขวางการบันทึก</p>
      <div className="hint-list">
        {rows.map((row) => (
          <Link href={`/requests/${row.id}`} key={row.id}>
            <span className="mono">{row.requestNo}</span>
            <small>{row.status} · {row.location}</small>
          </Link>
        ))}
      </div>
    </aside>
  );
}
