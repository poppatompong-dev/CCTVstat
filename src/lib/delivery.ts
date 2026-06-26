export const DELIVERY_METHODS = [
  "รับด้วยตนเอง",
  "อีเมล",
  "ไลน์ (LINE)",
  "ไปรษณีย์",
  "USB / แผ่นบันทึก",
  "ระบบออนไลน์",
  "อื่น ๆ",
] as const;

export type DeliveryMethod = (typeof DELIVERY_METHODS)[number];

export function normalizeDeliveryMethod(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}
