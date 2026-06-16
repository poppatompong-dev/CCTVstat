type SearchParams = Record<string, string | string[] | undefined>;

export function Feedback({ params }: { params: SearchParams }) {
  const ok = typeof params.ok === "string" ? params.ok : "";
  const error = typeof params.error === "string" ? params.error : "";
  if (!ok && !error) return null;
  return (
    <div className={`alert ${error ? "error" : "ok"}`} role="status">
      {error || ok}
    </div>
  );
}
