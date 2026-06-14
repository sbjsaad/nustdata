export const BILLING_CHARGE_FIELDS = [
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

export function buildChargesFromMapped(mapped, parseNumber) {
  return {
    arrear: parseNumber(mapped.arrear),
    sixMonthFixCharges: parseNumber(mapped.sixMonthFixCharges),
    securityHM: parseNumber(mapped.securityHM),
    wrContribution: parseNumber(mapped.wrContribution),
    messingCharges: parseNumber(mapped.messingCharges),
    fine: parseNumber(mapped.fine),
    utilityBillAccnMess: parseNumber(mapped.utilityBillAccnMess),
    sportsCharges: parseNumber(mapped.sportsCharges),
    umsCharges: parseNumber(mapped.umsCharges),
    convoChargesDE44: parseNumber(mapped.convoChargesDE44),
    outfitItemsDE47: parseNumber(mapped.outfitItemsDE47),
    dhobiUWash: parseNumber(mapped.dhobiUWash),
    laundryCharges: parseNumber(mapped.laundryCharges),
    degreeCharges: parseNumber(mapped.degreeCharges),
    processingFees: parseNumber(mapped.processingFees),
  };
}
