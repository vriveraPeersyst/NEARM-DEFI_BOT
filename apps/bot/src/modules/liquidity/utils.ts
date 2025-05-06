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
  