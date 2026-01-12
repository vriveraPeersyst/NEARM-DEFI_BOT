// apps/bot/src/modules/lending/lending.service.ts

import axios from 'axios';
import { LendingToken, LendingStats, BurrowApiResponse } from './types';
import { formatTokenSymbol, aprToApy } from './utils';

export class LendingService {
  private readonly apiBase = 'https://apidata.rhea.finance/burrow';
  
  // Tokens to track for lending data
  private readonly tokens = [
    'xtoken.rhealab.near',
    '17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1',
    'usdt.tether-token.near',
    'meta-pool.near',
    'wrap.near',
    '853d955acef822db058eb8505911ed77f175b99e.factory.bridge.near',
    'lst.rhealab.near',
    '2260fac5e5542a773aa44fbcfedf7c193bc2c599.factory.bridge.near',
    'nbtc.bridge.near',
    'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near',
    'dac17f958d2ee523a2206206994597c13d831ec7.factory.bridge.near',
    'zec.omft.near',
    '6b175474e89094c44da98b954eedeac495271d0f.factory.bridge.near',
    'eth.bridge.near',
  ];

  /** Fetch lending data for a specific token */
  private async fetchTokenData(tokenName: string): Promise<LendingToken | null> {
    try {
      const resp = await axios.get<BurrowApiResponse[]>(
        `${this.apiBase}/get_token_detail/${tokenName}`
      );

      if (!resp.data || resp.data.length === 0) {
        console.warn(`No data found for token: ${tokenName}`);
        return null;
      }

      const data = resp.data[0];
      
      // Convert APR to APY
      const baseSupplyApy = aprToApy(Number(data.token_supply_apr));
      const baseBorrowApy = aprToApy(Number(data.token_borrow_apr));
      
      // Add farming rewards if any
      const farmSupplyApr = Number(data.token_farm_supply_apr);
      const farmBorrowApr = Number(data.token_farm_borrow_apr);
      
      const totalSupplyApy = baseSupplyApy + farmSupplyApr;
      const totalBorrowApy = baseBorrowApy + farmBorrowApr;
      
      // Calculate available liquidity
      const supplied = Number(data.token_supplied_value);
      const borrowed = Number(data.token_borrowed_value);
      const reserved = Number(data.reserved) / Math.pow(10, data.extra_decimals);
      const availableLiquidity = supplied - borrowed - reserved;

      return {
        tokenName: data.token_name,
        symbol: formatTokenSymbol(data.token_name),
        tokenSuppliedValue: supplied,
        tokenBorrowedValue: borrowed,
        availableLiquidity: Math.max(0, availableLiquidity),
        supplyApy: totalSupplyApy,
        borrowApy: totalBorrowApy,
        totalSuppliers: data.total_suppliers,
        totalBorrowers: data.total_borrowers,
        utilizationRate: data.token_utilization_rate,
        tokenSupplyApr: Number(data.token_supply_apr),
        tokenBorrowApr: Number(data.token_borrow_apr),
        tokenFarmSupplyApr: farmSupplyApr,
        tokenFarmBorrowApr: farmBorrowApr,
      };
    } catch (error) {
      console.error(`Error fetching data for token ${tokenName}:`, error);
      return null;
    }
  }

  /** Fetch all lending tokens data */
  async getAllTokensData(): Promise<LendingToken[]> {
    const promises = this.tokens.map(token => this.fetchTokenData(token));
    const results = await Promise.all(promises);
    
    // Filter out null results and return valid tokens
    return results.filter((token): token is LendingToken => token !== null);
  }

  /** Get global lending statistics */
  async getGlobalStats(): Promise<LendingStats> {
    const tokens = await this.getAllTokensData();
    
    const totalSupplied = tokens.reduce((sum, token) => sum + token.tokenSuppliedValue, 0);
    const totalBorrowed = tokens.reduce((sum, token) => sum + token.tokenBorrowedValue, 0);
    const totalAvailableLiquidity = tokens.reduce((sum, token) => sum + token.availableLiquidity, 0);

    return {
      totalSupplied,
      totalBorrowed,
      totalAvailableLiquidity,
    };
  }

  /** Get top tokens by supplied value */
  async getTopTokensBySupplied(limit = 5): Promise<LendingToken[]> {
    const tokens = await this.getAllTokensData();
    return tokens
      .sort((a, b) => b.tokenSuppliedValue - a.tokenSuppliedValue)
      .slice(0, limit);
  }

  /** Get top tokens by borrowed value */
  async getTopTokensByBorrowed(limit = 5): Promise<LendingToken[]> {
    const tokens = await this.getAllTokensData();
    return tokens
      .sort((a, b) => b.tokenBorrowedValue - a.tokenBorrowedValue)
      .slice(0, limit);
  }

  /** Get top tokens by supply APY */
  async getTopTokensBySupplyApy(limit = 5): Promise<LendingToken[]> {
    const tokens = await this.getAllTokensData();
    return tokens
      .filter(token => token.supplyApy > 0)
      .sort((a, b) => b.supplyApy - a.supplyApy)
      .slice(0, limit);
  }

  /** Get top tokens by utilization rate */
  async getTopTokensByUtilization(limit = 5): Promise<LendingToken[]> {
    const tokens = await this.getAllTokensData();
    return tokens
      .sort((a, b) => b.utilizationRate - a.utilizationRate)
      .slice(0, limit);
  }
}
