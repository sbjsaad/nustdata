import {
  mapRow,
  getAllColumnValues,
  normalizeCmsId,
  parseDate,
  parseNumber,
} from "../../utils/excelParser.js";
import { buildChargesFromMapped } from "./billing.constants.js";

export const BILLING_COLUMN_MAP = {
  ser: ["Ser", "S/No.", "Serial"],
  category: ["Cat", "Category"],
  cmsId: [
    "CMS ID",
    "CMSID",
    "Cms Id",
    "CMS No",
    "CMS NO",
    "CMS Number",
    "CMS#",
    "CMS",
    "Reg No",
    "RegNo",
    "Registration No",
    "Roll No",
  ],
  name: ["Name"],
  fatherName: ["Father Name", "Father's Name"],
  fatherOccupation: ["Father OCC", "Father Occupation"],
  contactNumber: ["Contact No", "Contact Number"],
  email: ["Email Adress", "Email Address", "Email ID"],
  gender: ["Gender"],
  location: ["Loc", "Location"],
  arrear: ["Arrear"],
  sixMonthFixCharges: ["Six Month Fix Charges"],
  securityHM: ["Security H/M", "Security HM"],
  wrContribution: ["W&R Contribution", "WR Contribution"],
  messingCharges: ["Messing", "Messing Charges", "Mess Charges"],
  fine: ["Fine"],
  utilityBillAccnMess: ["Utility Bill Accn/Mess", "Utility Bill Accn Mess", "Utility Bill"],
  sportsCharges: ["Sports Charges"],
  umsCharges: ["UMS Charges"],
  convoChargesDE44: [
    "Convo Charges 1st Inst DE-44",
    "Convo Charges 1st Inst DE 44",
    "Convo Charges",
  ],
  outfitItemsDE47: ["Outfit Items DE-47", "Outfit Items DE 47", "Outfit Items"],
  dhobiUWash: ["Dhobi U/Wash", "Dhobi U Wash", "Washing Charges"],
  laundryCharges: ["Laundry Charges"],
  degreeCharges: ["Degree Charges DE-43", "Degree Charges"],
  processingFees: ["Processing Fees"],
  totalBill: ["Total Bill"],
  paid: ["Paid"],
  lateFeeFine: ["Late Fee Fine", "Late Fee"],
  balance: ["Balance"],
  dateOfBillsDeposited: ["Date of Bills Deposited", "Deposit Date"],
  voucherMonth: ["Voucher Month", "Bill Month"],
  voucherYear: ["Voucher Year", "Bill Year"],
};

function resolveVoucherMonth(value, meta = {}) {
  const raw = String(value || "").trim();
  if (!raw || /^\d[\d,.\s]*$/.test(raw)) {
    return String(meta.voucherMonth || "").trim();
  }
  return raw;
}

function resolveVoucherYear(value, meta = {}) {
  const raw = String(value || "").trim();
  if (!raw || /^\d[\d,.\s]{5,}$/.test(raw)) {
    return String(meta.voucherYear || "").trim();
  }
  return raw;
}

export function parseBillingRow(row, meta = {}) {
  const mapped = mapRow(row, BILLING_COLUMN_MAP);
  const cmsId = normalizeCmsId(mapped.cmsId);
  if (!cmsId) return null;

  const contactValues = getAllColumnValues(row, ["Contact No", "Contact Number", "Mobile No"]);
  const contactNumber = String(mapped.contactNumber || contactValues[0] || "").trim();
  const parentContactNumber = String(contactValues[1] || "").trim();

  const charges = buildChargesFromMapped(mapped, parseNumber);

  const totalBill =
    parseNumber(mapped.totalBill) || Object.values(charges).reduce((sum, v) => sum + v, 0);

  return {
    ser: String(mapped.ser || "").trim(),
    category: String(mapped.category || "NS").trim().toUpperCase(),
    cmsId,
    name: String(mapped.name || "").trim(),
    fatherName: String(mapped.fatherName || "").trim(),
    fatherOccupation: String(mapped.fatherOccupation || "").trim(),
    contactNumber,
    parentContactNumber,
    email: String(mapped.email || "").trim(),
    gender: String(mapped.gender || "").trim(),
    location: String(mapped.location || "").trim(),
    charges,
    totalBill,
    paid: parseNumber(mapped.paid),
    lateFeeFine: parseNumber(mapped.lateFeeFine),
    balance: parseNumber(mapped.balance) || totalBill - parseNumber(mapped.paid),
    dateOfBillsDeposited: parseDate(mapped.dateOfBillsDeposited),
    voucherMonth: resolveVoucherMonth(mapped.voucherMonth, meta),
    voucherYear: resolveVoucherYear(mapped.voucherYear, meta),
  };
}

export function validateBillingPayload(data) {
  const errors = [];
  if (!data.cmsId) errors.push("CMS ID is required");
  return errors;
}
