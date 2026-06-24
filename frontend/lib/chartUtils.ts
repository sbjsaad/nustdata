export const CHART_COLORS = [
  "#4f46e5",
  "#059669",
  "#d97706",
  "#dc2626",
  "#0284c7",
  "#7c3aed",
  "#db2777",
  "#0891b2",
];

export function formatPKR(amount: number) {
  return Math.round(amount).toLocaleString();
}

export function formatCompactPKR(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return formatPKR(amount);
}
