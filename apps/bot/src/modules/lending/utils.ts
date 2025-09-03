// apps/bot/src/modules/lending/utils.ts

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
 * Format large numbers in a more compact way
 * e.g. 1234567 → "1.23M", 1234 → "1.23K"
 */
export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  } else {
    return value.toFixed(2);
  }
}

/**
 * Convert APR to APY using compound interest formula
 * Assuming daily compounding (365 periods per year)
 */
export function aprToApy(apr: number): number {
  const periodsPerYear = 365;
  return Math.pow(1 + apr / periodsPerYear, periodsPerYear) - 1;
}

/**
 * Format timestamp as UTC date and time
 * e.g. "2025-09-03 14:30:25 UTC"
 */
export function formatUTCTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

/**
 * Format token symbol for display
 */
export function formatTokenSymbol(tokenName: string): string {
  const symbolMap: { [key: string]: string } = {
    'xtoken.rhealab.near': 'XRHEA',
    '17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1': 'USDC',
    'usdt.tether-token.near': 'USDT',
    'meta-pool.near': 'STNEAR',
    'wrap.near': 'NEAR',
    '853d955acef822db058eb8505911ed77f175b99e.factory.bridge.near': 'FRAX',
    'lst.rhealab.near': 'rNEAR',
    '2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near': 'WBTC',
    'nbtc.bridge.near': 'NBTC',
    'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near': 'USDC.e',
    'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near': 'USDT.e',
    'zec.omft.near': 'ZEC',
    '6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near': 'DAI',
    'eth.bridge.near': 'ETH',
  };
  
  return symbolMap[tokenName] || tokenName;
}
