export type MasterKind = "requester_types" | "categories" | "statuses" | "evidence_types";

export type MasterRow = {
  id: number;
  name: string;
  sort_order: number;
  is_active: boolean;
  semantic_key?: string | null;
};

export type RequestRow = {
  id: number;
  request_no: string;
  request_date: string;
  fiscal_year: number;
  sequence_no: number;
  requester_type_id: number;
  category_id: number;
  status_id: number;
  location_text: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
  requester_type_name: string;
  category_name: string;
  status_name: string;
  status_semantic_key: string | null;
  attachment_count: number;
};

export type AttachmentRow = {
  id: number;
  request_id: number;
  evidence_type_id: number;
  evidence_type_name: string;
  original_file_name: string;
  blob_url: string;
  download_url: string | null;
  blob_pathname: string;
  content_type: string | null;
  size_bytes: number;
  note: string | null;
  uploaded_at: string;
};

export type DashboardStats = {
  total: number;
  thisMonth: number;
  withAttachments: number;
  latestRequestNo: string | null;
  followUpTotal: number;
  overdueChecking: number;
  unresolvedTotal: number;
  followUpDays: number;
  followUpRows: RequestRow[];
};

export type RequestFilters = {
  q?: string;
  startDate?: string;
  endDate?: string;
  requesterTypeId?: string;
  categoryId?: string;
  statusId?: string;
  view?: string;
  statusSemanticKey?: string;
};

export type ReportData = {
  total: number;
  previousTotal: number;
  changePercent: number | null;
  foundRate: number | null;
  byCategory: Array<{ name: string; count: number }>;
  byRequesterType: Array<{ name: string; count: number }>;
  byStatus: Array<{ name: string; count: number }>;
  monthlyTrend: Array<{ month: string; count: number }>;
  rows: RequestRow[];
};

export type SmartDefaults = {
  requesterTypeId: number | null;
  statusId: number | null;
};
