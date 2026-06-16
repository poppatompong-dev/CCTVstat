import { requireAuth } from "@/lib/auth";
import { getMasterRows } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { Feedback } from "@/components/Feedback";
import { MasterSettings } from "@/components/MasterSettings";
import { PageHeader } from "@/components/PageHeader";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function EvidenceTypesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAuth();
  const [rows, params] = await Promise.all([getMasterRows("evidence_types"), searchParams]);
  return (
    <AppShell>
      <PageHeader
        title="จัดการประเภทหลักฐาน"
        description="กำหนดประเภทไฟล์แนบที่ใช้กับคำร้อง"
      />
      <Feedback params={params} />
      <MasterSettings
        title="ประเภทหลักฐานทั้งหมด"
        description="ปิดใช้งานได้โดยไม่กระทบไฟล์แนบเดิม"
        kind="evidence_types"
        rows={rows}
      />
    </AppShell>
  );
}
