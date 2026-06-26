import { Suspense } from "react";
import { requireAuth } from "@/lib/auth";
import { getMasters } from "@/lib/db";
import { todayInput } from "@/lib/dates";
import { perfLog, perfStart, timed } from "@/lib/perf";
import type { MasterRow } from "@/lib/types";
import { createRequestAction } from "@/app/actions";
import { AppShell } from "@/components/AppShell";
import { Feedback } from "@/components/Feedback";
import { PageHeader } from "@/components/PageHeader";
import { RequestForm } from "@/components/RequestForm";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type Masters = {
  requesterTypes: MasterRow[];
  categories: MasterRow[];
  statuses: MasterRow[];
  evidenceTypes: MasterRow[];
};

async function NewRequestFormSection({ mastersPromise }: { mastersPromise: Promise<Masters> }) {
  const masters = await mastersPromise;
  const defaultStatus = masters.statuses.find((row) => row.name === "รับคำร้องแล้ว") ?? masters.statuses[0];
  const defaultRequester = masters.requesterTypes.find((row) => row.name === "ประชาชน") ?? masters.requesterTypes[0];

  return (
    <section className="panel">
      <RequestForm
        action={createRequestAction}
        masters={masters}
        submitLabel="บันทึกและออกเลขคำร้อง"
        enableFormAssist
        showDuplicateHint
        request={{
          id: 0,
          request_no: "",
          request_date: todayInput(),
          fiscal_year: 0,
          sequence_no: 0,
          requester_type_id: defaultRequester?.id ?? 0,
          category_id: 0,
          status_id: defaultStatus?.id ?? 0,
          location_text: null,
          note: null,
          created_at: "",
          updated_at: "",
          requester_type_name: "",
          category_name: "",
          status_name: "",
          status_semantic_key: null,
          attachment_count: 0,
          delivery_count: 0,
        }}
      />
    </section>
  );
}

function NewRequestFormSkeleton() {
  return (
    <section className="panel">
      <div className="form-grid loading-form" aria-label="กำลังเตรียมฟอร์ม">
        <div className="span-2 skeleton-box number-preview-skeleton" />
        <div className="skeleton-field" />
        <div className="skeleton-field" />
        <div className="span-2 skeleton-category-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="skeleton-box category-skeleton" key={index} />
          ))}
        </div>
        <div className="skeleton-field" />
        <div className="span-2 skeleton-field" />
        <div className="span-2 skeleton-textarea" />
      </div>
    </section>
  );
}

export default async function NewRequestPage({ searchParams }: { searchParams: SearchParams }) {
  const routeStart = perfStart();
  try {
  await timed("/requests/new requireAuth", () => requireAuth());
  const mastersPromise = timed("/requests/new getMasters", () => getMasters());
  const params = await timed("/requests/new searchParams", () => searchParams);

  return (
    <AppShell>
      <PageHeader
        title="เพิ่มคำร้องใหม่"
        description="กรอกเฉพาะข้อมูลสถิติที่จำเป็น ระบบจะออกเลขคำร้องให้ทันทีหลังบันทึก"
      />
      <Feedback params={params} />
      <Suspense fallback={<NewRequestFormSkeleton />}>
        <NewRequestFormSection mastersPromise={mastersPromise} />
      </Suspense>
    </AppShell>
  );
  } finally {
    perfLog("/requests/new total", routeStart);
  }
}
