import { requireAuth } from "@/lib/auth";
import { getMasterRows } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { Feedback } from "@/components/Feedback";
import { MasterSettings } from "@/components/MasterSettings";
import { PageHeader } from "@/components/PageHeader";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function StatusesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAuth();
  const [rows, params] = await Promise.all([getMasterRows("statuses"), searchParams]);
  return (
    <AppShell>
      <PageHeader
        title="จัดการสถานะ"
        description="แก้ชื่อ เรียงลำดับ หรือปิดใช้งานสถานะ โดย logic ภายในยังใช้ semantic key เดิม"
      />
      <Feedback params={params} />
      <MasterSettings
        title="สถานะทั้งหมด"
        description="semantic key ใช้กับ dashboard/report และไม่ควรแก้ระหว่างทดสอบ"
        kind="statuses"
        rows={rows}
      />
    </AppShell>
  );
}
