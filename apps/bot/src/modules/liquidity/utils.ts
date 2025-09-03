// apps/bot/src/modules/liquidity/utils.ts

/**
 * Format a large number as USD with two decimals, e.g. 1234567.89 → "1,234,567.89"
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format a percentage number with two decimals, e.g. 12.3456 → "12.35"
 */
export function formatPercent(value: number): string {
  return value.toFixed(2);
}

/**
 * Format timestamp as UTC date and time
 * e.g. "2025-09-03 14:30:25 UTC"
 */
export function formatUTCTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}  