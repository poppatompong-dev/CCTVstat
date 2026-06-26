import {
  BarChart3,
  Camera,
  ClipboardList,
  FilePlus2,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  PackageCheck,
  ShieldCheck,
  Tags,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/actions";

const nav = [
  { href: "/", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/requests/new", label: "เพิ่มคำร้อง", icon: FilePlus2 },
  { href: "/requests", label: "ค้นหา/แก้ไข", icon: ClipboardList },
  { href: "/reports", label: "รายงาน", icon: BarChart3 },
  { href: "/settings/requester-types", label: "ประเภทผู้ขอ", icon: UsersRound },
  { href: "/settings/categories", label: "หมวดหมู่", icon: FolderKanban },
  { href: "/settings/statuses", label: "สถานะ", icon: ListChecks },
  { href: "/settings/evidence-types", label: "หลักฐาน", icon: Tags },
  { href: "/settings/delivery-item-types", label: "ข้อมูลส่งมอบ", icon: PackageCheck },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="เมนูหลัก">
        <Link href="/" className="brand-lockup">
          <span className="brand-icon">
            <Camera size={22} aria-hidden="true" />
          </span>
          <span>
            <strong>CCTVStat</strong>
            <small>กลุ่มงานสถิติข้อมูลและสารสนเทศ</small>
          </span>
        </Link>
        <nav className="nav-list">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="nav-item">
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <form action={logoutAction} className="sidebar-footer">
          <button className="btn ghost full" type="submit">
            <LogOut size={18} aria-hidden="true" />
            ออกจากระบบ
          </button>
        </form>
      </aside>
      <div className="main-rail">
        <header className="desktop-topbar" aria-label="แถบนำทางผู้บริหาร">
          <div>
            <p className="kicker">Executive Operations Center</p>
            <strong>ภาพรวมคำร้องและสถานะการให้บริการ CCTV</strong>
          </div>
          <div className="topbar-status">
            <span>
              <ShieldCheck size={16} aria-hidden="true" />
              Management-ready
            </span>
            <span>Live workspace</span>
          </div>
        </header>
        <header className="mobile-topbar">
          <Link href="/" className="brand-lockup compact">
            <span className="brand-icon">
              <Camera size={20} aria-hidden="true" />
            </span>
            <strong>CCTVStat</strong>
          </Link>
          <form action={logoutAction}>
            <button className="icon-btn" type="submit" aria-label="ออกจากระบบ">
              <LogOut size={18} />
            </button>
          </form>
        </header>
        <main className="content">{children}</main>
      </div>
      <nav className="bottom-nav" aria-label="เมนูมือถือ">
        {nav.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
