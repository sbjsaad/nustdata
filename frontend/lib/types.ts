export type StudentCategory = "NS" | "GC" | "PC" | "AES";
export type StudentType = "boarder" | "day_scholar";
export type ChargeType = "messing" | "washing" | "laundry" | "sports" | "security" | "processing" | "other";
export type SheetType = "auto" | "student_master" | "monthly_billing" | "invoice";

export interface Student {
  _id?: string;
  sNo?: string;
  category: StudentCategory;
  de?: string;
  discipline?: string;
  regNo?: string;
  cmsId: string;
  name: string;
  fatherName?: string;
  fatherOccupation?: string;
  contactNumber?: string;
  parentContactNumber?: string;
  email?: string;
  gender?: string;
  location?: string;
  studentType: StudentType;
  isDerived?: boolean;
}

export interface BillingCharges {
  arrear?: number;
  sixMonthFixCharges?: number;
  securityHM?: number;
  wrContribution?: number;
  messingCharges?: number;
  fine?: number;
  utilityBillAccnMess?: number;
  sportsCharges?: number;
  umsCharges?: number;
  convoChargesDE44?: number;
  outfitItemsDE47?: number;
  dhobiUWash?: number;
  laundryCharges?: number;
  degreeCharges?: number;
  processingFees?: number;
}

export interface Billing {
  _id?: string;
  ser?: string;
  cmsId: string;
  category?: string;
  name?: string;
  fatherName?: string;
  fatherOccupation?: string;
  contactNumber?: string;
  parentContactNumber?: string;
  email?: string;
  gender?: string;
  location?: string;
  charges: BillingCharges;
  totalBill: number;
  paid: number;
  lateFeeFine?: number;
  balance: number;
  voucherMonth?: string;
  voucherYear?: string;
  dateOfBillsDeposited?: string;
}

export interface InvoiceHead {
  head: string;
  amount: number;
}

export interface Invoice {
  _id?: string;
  invoiceNo?: string;
  regNo?: string;
  cmsId?: string;
  heads: InvoiceHead[];
  balance: number;
  dueDate?: string;
  amountAfterDueDate?: number;
  name?: string;
  mobileNo?: string;
  voucherMonth?: string;
  voucherYear?: string;
}

export interface ChargeEntry {
  _id?: string;
  cmsId: string;
  studentName?: string;
  category?: string;
  studentType?: StudentType;
  chargeType: ChargeType;
  amount: number;
  month?: string;
  year?: string;
  notes?: string;
  submittedBy?: string;
  createdAt?: string;
}

export interface Category {
  _id?: string;
  code: StudentCategory;
  name: string;
  description?: string;
  chargeHeads: string[];
}

export interface UploadLog {
  _id?: string;
  batchId: string;
  fileName: string;
  sheetType: string;
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
  rejected?: number;
  status: string;
  voucherMonth?: string;
  voucherYear?: string;
  createdAt?: string;
}

export interface UploadProcessResult {
  results: {
    created: number;
    updated: number;
    skipped: number;
    rejected?: number;
    total: number;
    errors?: { message: string; cmsId?: string; regNo?: string }[];
    billing?: {
      created: number;
      updated: number;
      skipped: number;
      rejected?: number;
    };
    students?: {
      created: number;
      updated: number;
      skipped: number;
      rejected?: number;
    };
  };
  log: UploadLog;
  sheetType: string;
  saved?: number;
  status?: string;
}

export interface DashboardStats {
  students: {
    total: number;
    byCategory: Record<string, number>;
    byType: Record<string, number>;
  };
  billing: {
    totalRecords: number;
    totalBalance: number;
    totalPaid: number;
    totalBilled: number;
    collectionRate: number;
    monthlyTrend: {
      period: string;
      totalBill: number;
      paid: number;
      balance: number;
      records: number;
    }[];
    chargeBreakdown: { name: string; value: number }[];
  };
  charges: {
    totalEntries: number;
    totalAmount: number;
    byType: { type: string; label: string; amount: number; count: number }[];
  };
  invoices: { total: number };
  uploads: {
    total: number;
    summary: Record<string, number>;
  };
  recentUploads: UploadLog[];
}

export interface StudentProfile {
  student: Student;
  billings: Billing[];
  invoices: Invoice[];
  charges: ChargeEntry[];
  chargeSummary: Record<string, number>;
  totals: {
    totalBalance: number;
    totalPaid: number;
    totalCharges: number;
    latestBill: number;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedList<T> extends PaginationMeta {
  items: T[];
}

export interface Paginated<T> extends PaginationMeta {
  [key: string]: T[] | number | boolean;
}

export const CATEGORY_LABELS: Record<StudentCategory, string> = {
  NS: "Nursing School",
  GC: "General Category",
  PC: "Professional College",
  AES: "AES",
};

export const STUDENT_TYPE_LABELS: Record<StudentType, string> = {
  boarder: "Boarder",
  day_scholar: "Day Scholar",
};

export const CHARGE_TYPE_LABELS: Record<ChargeType, string> = {
  messing: "Messing Charges",
  washing: "Washing / Dhobi",
  laundry: "Laundry Charges",
  sports: "Sports Charges",
  security: "Security H/M",
  processing: "Processing Fees",
  other: "Other",
};

export const SHEET_TYPE_LABELS: Record<SheetType, string> = {
  auto: "Auto Detect",
  student_master: "Student Master",
  monthly_billing: "Monthly Billing",
  invoice: "Invoice / Voucher",
};
