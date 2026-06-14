import { CHARGE_TYPES } from "./charge.model.js";

export function validateChargePayload(data) {
  const errors = [];
  if (!data.cmsId) errors.push("CMS ID is required");
  if (!data.chargeType) errors.push("Charge type is required");
  if (data.chargeType && !CHARGE_TYPES.includes(data.chargeType)) {
    errors.push(`Charge type must be one of: ${CHARGE_TYPES.join(", ")}`);
  }
  if (data.amount == null || Number(data.amount) < 0) {
    errors.push("Valid amount is required");
  }
  return errors;
}

export const CHARGE_TYPE_LABELS = {
  messing: "Messing Charges",
  washing: "Washing / Dhobi",
  laundry: "Laundry Charges",
  sports: "Sports Charges",
  security: "Security H/M",
  processing: "Processing Fees",
  other: "Other",
};
