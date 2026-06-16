import { requireAuth } from "@/lib/auth";
import { getMasterRows } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { Feedback } from "@/components/Feedback";
import { MasterSettings } from "@/components/MasterSettings";
import { PageHeader } from "@/components/PageHeader";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CategoriesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAuth();
  const [rows, params] = await Promise.all([getMasterRows("categories"), searchParams]);
  return (
    <AppShell>
      <PageHeader
        title="จัดการหมวดหมู่"
        description="เพิ่ม แก้ไข หรือปิดใช้งานหมวดหมู่การขอดูภาพ"
      />
      <Feedback params={params} />
      <MasterSettings
        title="หมวดหมู่ทั้งหมด"
        description="รายการที่ปิดใช้งานจะไม่แสดงในฟอร์มใหม่ แต่ข้อมูลเก่ายังอยู่"
        kind="categories"
        rows={rows}
      />
    </AppShell>
  );
}
