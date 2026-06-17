import { requireAuth } from "@/lib/auth";
import { getMasterRows } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { Feedback } from "@/components/Feedback";
import { MasterSettings } from "@/components/MasterSettings";
import { PageHeader } from "@/components/PageHeader";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function RequesterTypesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAuth();
  const [rows, params] = await Promise.all([getMasterRows("requester_types"), searchParams]);
  return (
    <AppShell>
      <PageHeader
        title="จัดการประเภทผู้ขอ"
        description="เพิ่ม แก้ไข หรือปิดใช้งานประเภทผู้ขอที่ใช้ในรายงาน"
      />
      <Feedback params={params} />
      <MasterSettings
        title="ประเภทผู้ขอทั้งหมด"
        description="รายการ inactive จะไม่แสดงเป็นค่าใหม่ แต่ข้อมูลย้อนหลังยังอ่านได้"
        kind="requester_types"
        rows={rows}
      />
    </AppShell>
  );
}
