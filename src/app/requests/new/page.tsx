import { requireAuth } from "@/lib/auth";
import { getLocationSuggestions, getMasters, getSmartDefaults } from "@/lib/db";
import { todayInput } from "@/lib/dates";
import { perfLog, perfStart, timed } from "@/lib/perf";
import { createRequestAction } from "@/app/actions";
import { AppShell } from "@/components/AppShell";
import { Feedback } from "@/components/Feedback";
import { PageHeader } from "@/components/PageHeader";
import { RequestForm } from "@/components/RequestForm";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function NewRequestPage({ searchParams }: { searchParams: SearchParams }) {
  const routeStart = perfStart();
  try {
  await timed("/requests/new requireAuth", () => requireAuth());
  const [masters, smartDefaults, locationSuggestions, params] = await Promise.all([
    timed("/requests/new getMasters", () => getMasters()),
    timed("/requests/new getSmartDefaults", () => getSmartDefaults()),
    timed("/requests/new getLocationSuggestions", () => getLocationSuggestions()),
    timed("/requests/new searchParams", () => searchParams),
  ]);
  const defaultStatus = masters.statuses.find((row) => row.name === "รับคำร้องแล้ว") ?? masters.statuses[0];
  const defaultRequester = masters.requesterTypes.find((row) => row.name === "ประชาชน") ?? masters.requesterTypes[0];
  const requesterTypeId = smartDefaults.requesterTypeId ?? defaultRequester?.id ?? 0;
  const statusId = smartDefaults.statusId ?? defaultStatus?.id ?? 0;

  return (
    <AppShell>
      <PageHeader
        title="เพิ่มคำร้องใหม่"
        description="กรอกเฉพาะข้อมูลสถิติที่จำเป็น ระบบจะออกเลขคำร้องให้ทันทีหลังบันทึก"
      />
      <Feedback params={params} />
      <section className="panel">
        <RequestForm
          action={createRequestAction}
          masters={masters}
          submitLabel="บันทึกและออกเลขคำร้อง"
          locationSuggestions={locationSuggestions}
          showDuplicateHint
          request={{
            id: 0,
            request_no: "",
            request_date: todayInput(),
            fiscal_year: 0,
            sequence_no: 0,
            requester_type_id: requesterTypeId,
            category_id: 0,
            status_id: statusId,
            location_text: null,
            note: null,
            created_at: "",
            updated_at: "",
            requester_type_name: "",
            category_name: "",
            status_name: "",
            status_semantic_key: null,
            attachment_count: 0,
          }}
        />
      </section>
    </AppShell>
  );
  } finally {
    perfLog("/requests/new total", routeStart);
  }
}
