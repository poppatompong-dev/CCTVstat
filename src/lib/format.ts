export function formatNumber(value: number | string | null | undefined) {
  return new Intl.NumberFormat("th-TH").format(Number(value ?? 0));
}

export function formatBytes(bytes: number | string | null | undefined) {
  const value = Number(bytes ?? 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export function optionalText(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}
