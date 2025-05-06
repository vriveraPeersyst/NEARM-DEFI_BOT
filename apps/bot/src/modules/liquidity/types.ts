// apps/bot/src/modules/liquidity/types.ts

export interface GlobalStats {
    tvl: number;
    volume24h: number;
  }
  
  export interface Pool {
    id: string;
    tokenSymbols: string[];
    tvl: number;
    volume24h: number;
    apy: number;
    farmApy: number;
    totalApy: number;
  }
  