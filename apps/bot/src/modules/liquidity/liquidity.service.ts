// apps/bot/src/modules/liquidity/liquidity.service.ts

import axios from 'axios';
import { GlobalStats, Pool } from './types';

export class LiquidityService {
  private readonly apiBase = 'https://api.ref.finance';

  /** Fetch total TVL and 24h volume across all pools */
  async getGlobalStats(): Promise<GlobalStats> {
    const resp = await axios.get<{
      code: number;
      data: { tvl: string; volume_24h: string };
    }>(`${this.apiBase}/all-pool-data`);

    return {
      tvl: Number(resp.data.data.tvl),
      volume24h: Number(resp.data.data.volume_24h),
    };
  }

  /** Fetch top-n classic pools sorted by TVL */
  async getTopPools(limit = 4): Promise<Pool[]> {
    const resp = await axios.get<{
      code: number;
      data: { list: any[] };
    }>(
      `${this.apiBase}/pool/search` +
        `?type=classic&sort=tvl&limit=${limit}` +
        `&labels=&offset=0&hide_low_pool=true&order_by=desc`
    );

    return resp.data.data.list.slice(0, limit).map((item) => {
      const apy = Number(item.apy);
      const farmApy = Number(item.farm_apy);
      return {
        id: item.id,
        tokenSymbols: item.token_symbols,
        tvl: Number(item.tvl),
        volume24h: Number(item.volume_24h),
        apy,
        farmApy,
        totalApy: apy + farmApy,
      };
    });
  }
}
