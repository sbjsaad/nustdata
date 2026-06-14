import { mapRow, parseDate, parseNumber } from "../../utils/excelParser.js";

export const INVOICE_BASE_MAP = {
  invoiceNo: ["Invoice No", "Invoice Number"],
  regNo: ["Reg No", "RegNo"],
  balance: ["Balance"],
  dueDate: ["Due Date"],
  amountAfterDueDate: ["Amount After Due Date"],
  expiryDate: ["Expiry Date"],
  issueDate: ["Issue Date"],
  voucherMonth: ["Voucher Month"],
  voucherYear: ["Voucher Year"],
  name: ["Name"],
  mobileNo: ["Mobile No", "Mobile Number"],
  emailId: ["Email ID", "Email"],
  branch: ["Branch"],
};

export function extractInvoiceHeads(row) {
  const heads = [];
  for (let i = 1; i <= 10; i += 1) {
    const headKey = `Head ${i}`;
    const amountKey = `Amount ${i}`;
    const headEntry = Object.entries(row).find(([k]) =>
      k.trim().toLowerCase() === headKey.toLowerCase()
    );
    const amountEntry = Object.entries(row).find(([k]) =>
      k.trim().toLowerCase() === amountKey.toLowerCase()
    );
    const head = headEntry ? String(headEntry[1]).trim() : "";
    const amount = amountEntry ? parseNumber(amountEntry[1]) : 0;
    if (head || amount) {
      heads.push({ head: head || `Head ${i}`, amount });
    }
  }
  return heads;
}

export function parseInvoiceRow(row, meta = {}) {
  const mapped = mapRow(row, INVOICE_BASE_MAP);
  const regNo = String(mapped.regNo || "").trim();
  if (!regNo && !mapped.invoiceNo) return null;

  const heads = extractInvoiceHeads(row);
  const totalFromHeads = heads.reduce((sum, h) => sum + h.amount, 0);

  return {
    invoiceNo: String(mapped.invoiceNo || "").trim(),
    regNo,
    cmsId: regNo,
    heads,
    balance: parseNumber(mapped.balance) || totalFromHeads,
    dueDate: parseDate(mapped.dueDate),
    amountAfterDueDate: parseNumber(mapped.amountAfterDueDate),
    expiryDate: parseDate(mapped.expiryDate),
    issueDate: parseDate(mapped.issueDate),
    voucherMonth: String(mapped.voucherMonth || meta.voucherMonth || "").trim(),
    voucherYear: String(mapped.voucherYear || meta.voucherYear || "").trim(),
    name: String(mapped.name || "").trim(),
    mobileNo: String(mapped.mobileNo || "").trim(),
    emailId: String(mapped.emailId || "").trim(),
    branch: String(mapped.branch || "").trim(),
  };
}
