"use client";

import { useEffect, useState } from "react";

type FormAssistPayload = {
  smartDefaults?: {
    requesterTypeId: number | null;
    statusId: number | null;
  };
  locationSuggestions?: string[];
};

export function RequestFormAssist() {
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const touched = new Set<string>();
    const requester = document.querySelector<HTMLSelectElement>('select[data-smart-default="requester"]');
    const status = document.querySelector<HTMLSelectElement>('select[data-smart-default="status"]');
    const selects = [requester, status].filter(Boolean) as HTMLSelectElement[];

    const markTouched = (event: Event) => {
      const target = event.currentTarget as HTMLSelectElement;
      touched.add(target.name);
    };

    selects.forEach((select) => select.addEventListener("change", markTouched, { once: true }));

    fetch("/api/requests/form-assist", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data: FormAssistPayload | null) => {
        if (!data) return;

        if (data.smartDefaults?.requesterTypeId && requester && !touched.has(requester.name)) {
          requester.value = String(data.smartDefaults.requesterTypeId);
          requester.dispatchEvent(new Event("change", { bubbles: true }));
        }

        if (data.smartDefaults?.statusId && status && !touched.has(status.name)) {
          status.value = String(data.smartDefaults.statusId);
          status.dispatchEvent(new Event("change", { bubbles: true }));
        }

        setLocationSuggestions(data.locationSuggestions ?? []);
      })
      .catch(() => undefined);

    return () => {
      controller.abort();
      selects.forEach((select) => select.removeEventListener("change", markTouched));
    };
  }, []);

  return (
    <datalist id="location-suggestions">
      {locationSuggestions.map((value) => (
        <option key={value} value={value} />
      ))}
    </datalist>
  );
}
