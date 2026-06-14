import { mapRow, parseDate, parseNumber } from "../../utils/excelParser.js";

export const BILLING_COLUMN_MAP = {
  ser: ["Ser", "S/No.", "Serial"],
  category: ["Cat", "Category"],
  cmsId: ["CMS ID", "CMSID", "Cms Id"],
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
  laundryCharges: ["Laundry Charges"],
  umsCharges: ["UMS Charges"],
  sportsCharges: ["Sports Charges"],
  degreeCharges: ["Degree Charges DE-43", "Degree Charges"],
  dhobiUWash: ["Dhobi U/Wash", "Dhobi U Wash", "Washing Charges"],
  messingCharges: ["Messing Charges", "Mess Charges"],
  processingFees: ["Processing Fees"],
  totalBill: ["Total Bill"],
  paid: ["Paid"],
  lateFeeFine: ["Late Fee Fine", "Late Fee"],
  balance: ["Balance"],
  dateOfBillsDeposited: ["Date of Bills Deposited", "Deposit Date"],
  voucherMonth: ["Voucher Month", "Month"],
  voucherYear: ["Voucher Year", "Year"],
};

export function parseBillingRow(row, meta = {}) {
  const mapped = mapRow(row, BILLING_COLUMN_MAP);
  const cmsId = String(mapped.cmsId || "").trim();
  if (!cmsId) return null;

  const charges = {
    arrear: parseNumber(mapped.arrear),
    sixMonthFixCharges: parseNumber(mapped.sixMonthFixCharges),
    securityHM: parseNumber(mapped.securityHM),
    wrContribution: parseNumber(mapped.wrContribution),
    laundryCharges: parseNumber(mapped.laundryCharges),
    umsCharges: parseNumber(mapped.umsCharges),
    sportsCharges: parseNumber(mapped.sportsCharges),
    degreeCharges: parseNumber(mapped.degreeCharges),
    dhobiUWash: parseNumber(mapped.dhobiUWash),
    messingCharges: parseNumber(mapped.messingCharges),
    processingFees: parseNumber(mapped.processingFees),
  };

  const totalBill = parseNumber(mapped.totalBill) ||
    Object.values(charges).reduce((sum, v) => sum + v, 0);

  return {
    ser: String(mapped.ser || "").trim(),
    category: String(mapped.category || "NS").trim().toUpperCase(),
    cmsId,
    name: String(mapped.name || "").trim(),
    fatherName: String(mapped.fatherName || "").trim(),
    fatherOccupation: String(mapped.fatherOccupation || "").trim(),
    contactNumber: String(mapped.contactNumber || "").trim(),
    email: String(mapped.email || "").trim(),
    gender: String(mapped.gender || "").trim(),
    location: String(mapped.location || "").trim(),
    charges,
    totalBill,
    paid: parseNumber(mapped.paid),
    lateFeeFine: parseNumber(mapped.lateFeeFine),
    balance: parseNumber(mapped.balance) || totalBill - parseNumber(mapped.paid),
    dateOfBillsDeposited: parseDate(mapped.dateOfBillsDeposited),
    voucherMonth: String(mapped.voucherMonth || meta.voucherMonth || "").trim(),
    voucherYear: String(mapped.voucherYear || meta.voucherYear || "").trim(),
  };
}

export function validateBillingPayload(data) {
  const errors = [];
  if (!data.cmsId) errors.push("CMS ID is required");
  return errors;
}
