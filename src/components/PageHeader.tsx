import Link from "next/link";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string; icon?: React.ReactNode };
}) {
  return (
    <div className="page-header">
      <div>
        <p className="kicker">CCTV Request Statistics</p>
        <h1>{title}</h1>
        {description ? <p className="muted">{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="btn primary">
          {action.icon}
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
