export const REQUEST_NO_PATTERN = /^C(\d{2})-(\d{4})$/;

export function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

export function fiscalYearFromDate(dateInput: string) {
  const date = new Date(`${dateInput}T00:00:00.000Z`);
  const ceYear = date.getUTCFullYear();
  const month = date.getUTCMonth();
  return month >= 9 ? ceYear + 544 : ceYear + 543;
}

export function requestNoPrefix(dateInput: string) {
  return `C${String(fiscalYearFromDate(dateInput) % 100).padStart(2, "0")}`;
}

export function formatRequestNo(dateInput: string, sequence: number) {
  return `${requestNoPrefix(dateInput)}-${String(sequence).padStart(4, "0")}`;
}

export function parseRequestNo(requestNo: string) {
  const match = requestNo.trim().toUpperCase().match(REQUEST_NO_PATTERN);
  if (!match) return null;
  return {
    yy: Number(match[1]),
    sequence: Number(match[2]),
    normalized: `C${match[1]}-${match[2]}`,
  };
}

export function validateRequestNoForDate(requestNo: string, dateInput: string) {
  const parsed = parseRequestNo(requestNo);
  if (!parsed) {
    return "รูปแบบเลขคำร้องต้องเป็น CYY-NNNN เช่น C69-0001";
  }

  const expected = fiscalYearFromDate(dateInput) % 100;
  if (parsed.yy !== expected) {
    return "เลขคำร้องไม่ตรงกับปีงบประมาณของวันที่รับคำร้อง";
  }

  if (parsed.sequence < 1) {
    return "ลำดับเลขคำร้องต้องมากกว่า 0";
  }

  return null;
}

export function formatThaiDate(value?: string | Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function formatThaiDateTime(value?: string | Date | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function defaultReportRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: now.toISOString().slice(0, 10),
  };
}
