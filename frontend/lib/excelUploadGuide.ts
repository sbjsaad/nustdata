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
  combinedFormat:
    "NUST combined sheets (Student + Parents sub-columns plus billing charges) should use Monthly Billing or Auto Detect. Both student records and billing records are saved in one upload.",
};

export const EXCEL_SHEET_GUIDES: ExcelSheetGuide[] = [
  {
    type: "student_master",
    icon: "🎓",
    title: "Student Master (Combined NUST Sheet)",
    summary:
      "Combined student + billing Excel with Student/Parents group row. All student fields and every charge column are saved.",
    requiredColumns: ["CMS ID", "Name"],
    optionalColumns: [
      "Ser / S/No.",
      "Cat (NS, GC, PC, AES)",
      "DE",
      "Discp / Discipline",
      "Father Name",
      "Father OCC",
      "Contact No (student)",
      "Contact No (parent)",
      "Email Adress",
      "Gender",
      "Loc / Location",
    ],
    detectHint: "Detected when CMS ID and Name are present without billing columns (Total Bill, Arrear, etc.).",
    notes: [
      "If your Excel has Student/Parents group headers with billing columns, billing is imported automatically.",
      "Two Contact No columns are supported — first is student, second is parent.",
      "Category defaults to NS if not provided.",
    ],
  },
  {
    type: "monthly_billing",
    icon: "📋",
    title: "Monthly Billing (Combined NUST Sheet)",
    summary:
      "Full NUST billing sheet with Student + Parents group row and all charge columns. Saves students and billing in one upload.",
    requiredColumns: ["CMS ID"],
    optionalColumns: [
      "Ser · Cat · DE · Discp",
      "Name · Father Name · Father OCC",
      "Contact No (student) · Contact No (parent)",
      "Email Adress · Gender · Loc",
      "Arrear · Six Month Fix Charges · Security H/M · W&R Contribution",
      "Messing · Fine · Utility Bill Accn/Mess",
      "Sports Charges · UMS Charges",
      "Convo Charges 1st Inst DE-44 · Outfit Items DE-47 · Dhobi U/Wash",
      "Total Bill · Paid · Late Fee Fine · Balance · Date of Bills Deposited",
      "Voucher Month / Year (or enter in upload form)",
    ],
    detectHint:
      "Detected when CMS ID and billing columns (Total Bill, Laundry, Arrear, etc.) are present. Supports two-row headers (Student | Parents).",
    notes: [
      "Group header rows (Student, Parents) above column names are detected automatically.",
      "Enter Voucher Month and Year in the upload form if they are not in the Excel file.",
      "If Total Bill is missing, it is calculated from charge columns.",
      "Student records are created or updated alongside billing records.",
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
