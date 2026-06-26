import { requireAuth } from "@/lib/auth";
import { getMasterRows } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { Feedback } from "@/components/Feedback";
import { MasterSettings } from "@/components/MasterSettings";
import { PageHeader } from "@/components/PageHeader";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function DeliveryItemTypesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAuth();
  const [rows, params] = await Promise.all([
    getMasterRows("delivery_item_types"),
    searchParams,
  ]);
  return (
    <AppShell>
      <PageHeader
        title="จัดการประเภทข้อมูลที่ส่งมอบ"
        description="เพิ่ม แก้ไข หรือปิดใช้งานประเภทข้อมูลที่ส่งมอบให้ผู้ร้อง"
      />
      <Feedback params={params} />
      <MasterSettings
        title="ประเภทข้อมูลที่ส่งมอบทั้งหมด"
        description="ใช้บันทึกว่าได้ส่งมอบข้อมูลใดให้ผู้ร้องไปแล้วบ้าง รายการที่ปิดใช้งานจะไม่แสดงในฟอร์ม"
        kind="delivery_item_types"
        rows={rows}
      />
    </AppShell>
  );
}
