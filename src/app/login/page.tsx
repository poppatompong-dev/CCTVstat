import { ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/actions";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-mark">
          <ShieldCheck aria-hidden="true" size={28} />
        </div>
        <div className="stack gap-2">
          <p className="kicker">CCTVStat</p>
          <h1>ระบบบันทึกสถิติคำร้อง CCTV</h1>
          <p className="muted">
            เข้าสู่ระบบด้วยรหัสผ่านกลางสำหรับช่วงทดลองใช้งานบน Vercel
          </p>
        </div>
        {error ? <p className="alert error">{error}</p> : null}
        <form action={loginAction} className="stack gap-4">
          <label className="field">
            <span>รหัสผ่าน</span>
            <input name="password" type="password" autoComplete="current-password" required autoFocus />
          </label>
          <button className="btn primary full" type="submit">
            เข้าระบบ
          </button>
        </form>
      </section>
    </main>
  );
}
