import type { SheetType } from "./types";

export interface ExcelSheetGuide {
  type: Exclude<SheetType, "auto">;
  icon: string;
  title: string;
  summary: string;
  requiredColumns: string[];
  optionalColumns: string[];
  detectHint: string;
  notes?: string[];
}

export const EXCEL_FILE_INFO = {
  formats: [".xlsx", ".xls", ".csv"],
  formatsLabel: "Excel (.xlsx, .xls) or CSV",
  firstSheetOnly: "Only the first sheet in the file is imported. Put the correct data on the first sheet.",
  autoDetect:
    "Auto Detect reads column headers to identify the sheet type. If detection fails, select the type manually below.",
};

export const EXCEL_SHEET_GUIDES: ExcelSheetGuide[] = [
  {
    type: "student_master",
    icon: "🎓",
    title: "Student Master",
    summary: "Student registration and contact details. Use for new lists or updates.",
    requiredColumns: ["CMS ID or Reg No", "Name"],
    optionalColumns: [
      "S/No.",
      "Cat (NS, GC, PC, AES)",
      "DE",
      "Discp / Discipline",
      "Father's Name",
      "Father OCC",
      "Contact Number",
      "Email ID",
      "Gender",
      "Loc / Location",
      "Student Type (Boarder / Day Scholar)",
    ],
    detectHint: "Detected when Reg No and Father Name or Contact Number columns are present.",
    notes: [
      "If CMS ID is missing, Reg No is used as CMS ID.",
      "Category defaults to NS if not provided.",
    ],
  },
  {
    type: "monthly_billing",
    icon: "📋",
    title: "Monthly Billing",
    summary: "Monthly mess, washing, laundry, total bill, paid amount, and balance.",
    requiredColumns: ["CMS ID"],
    optionalColumns: [
      "Ser / S/No.",
      "Cat",
      "Name",
      "Father Name",
      "Contact No",
      "Email",
      "Messing Charges",
      "Dhobi U/Wash (Washing)",
      "Laundry Charges",
      "Sports Charges",
      "Security H/M",
      "Processing Fees",
      "Arrear",
      "Total Bill",
      "Paid",
      "Late Fee Fine",
      "Balance",
      "Voucher Month",
      "Voucher Year",
      "Date of Bills Deposited",
    ],
    detectHint: "Detected when CMS ID and Laundry or Total Bill columns are present.",
    notes: [
      "If Voucher Month/Year are not in the Excel file, enter them in the upload form.",
      "If Total Bill is missing, it is calculated from charge columns.",
    ],
  },
  {
    type: "invoice",
    icon: "🧾",
    title: "Invoice / Voucher",
    summary: "Invoice number, student reg no, and Head 1–10 with matching amounts.",
    requiredColumns: ["Reg No or Invoice No"],
    optionalColumns: [
      "Invoice No",
      "Head 1 … Head 10",
      "Amount 1 … Amount 10",
      "Balance",
      "Due Date",
      "Issue Date",
      "Expiry Date",
      "Amount After Due Date",
      "Name",
      "Mobile No",
      "Email ID",
      "Branch",
      "Voucher Month",
      "Voucher Year",
    ],
    detectHint: "Detected when Invoice No and Head 1 columns are present.",
    notes: [
      "Each Head should have a matching Amount column (Amount 1, Amount 2, etc.).",
      "If Balance is missing, the total of Head amounts is used.",
    ],
  },
];

export function getSheetGuide(type: SheetType) {
  if (type === "auto") return null;
  return EXCEL_SHEET_GUIDES.find((g) => g.type === type) ?? null;
}
