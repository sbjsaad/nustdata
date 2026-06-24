import type { BillingCharges } from "./types";
import { formatPKR } from "./chartUtils";

export const BILLING_CHARGE_FIELDS: {
  key: keyof BillingCharges;
  label: string;
}[] = [
  { key: "arrear", label: "Arrear" },
  { key: "sixMonthFixCharges", label: "Six Month Fix Charges" },
  { key: "securityHM", label: "Security H/M" },
  { key: "wrContribution", label: "W&R Contribution" },
  { key: "messingCharges", label: "Messing" },
  { key: "fine", label: "Fine" },
  { key: "utilityBillAccnMess", label: "Utility Bill Accn/Mess" },
  { key: "sportsCharges", label: "Sports Charges" },
  { key: "umsCharges", label: "UMS Charges" },
  { key: "convoChargesDE44", label: "Convo Charges 1st Inst DE-44" },
  { key: "outfitItemsDE47", label: "Outfit Items DE-47" },
  { key: "dhobiUWash", label: "Dhobi U/Wash" },
  { key: "laundryCharges", label: "Laundry Charges" },
  { key: "degreeCharges", label: "Degree Charges" },
  { key: "processingFees", label: "Processing Fees" },
];

export function formatChargeAmount(value?: number) {
  if (value == null || value === 0) return "—";
  return formatPKR(value);
}

export function formatDisplayValue(value?: string | number | null) {
  if (value == null || value === "") return "—";
  return String(value);
}
