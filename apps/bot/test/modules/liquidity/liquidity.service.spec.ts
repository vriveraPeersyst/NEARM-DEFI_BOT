// apps/bot/test/modules/liquidity/liquidity.service.spec.ts

import axios from 'axios';
import { LiquidityService } from '../../../src/modules/liquidity/liquidity.service';
import { GlobalStats, Pool } from '../../../src/modules/liquidity/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LiquidityService', () => {
  let svc: LiquidityService;

  beforeEach(() => {
    svc = new LiquidityService();
    jest.clearAllMocks();
  });

  it('getGlobalStats parses strings to numbers', async () => {
    const fake = { code: 0, data: { tvl: '123.45', volume_24h: '67.89' } };
    mockedAxios.get.mockResolvedValueOnce({ data: fake });

    const result = await svc.getGlobalStats();
    expect(result).toEqual<GlobalStats>({ tvl: 123.45, volume24h: 67.89 });
    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.ref.finance/all-pool-data');
  });

  it('getTopPools returns correct Pool[] with totalApy', async () => {
    const listItem = {
      id: '1',
      token_symbols: ['AAA','BBB'],
      tvl: '1000',
      volume_24h: '200',
      apy: '5',
      farm_apy: '2.5',
    };
    const fake = { code: 0, data: { list: [ listItem ] } };
    mockedAxios.get.mockResolvedValueOnce({ data: fake });

    const pools = await svc.getTopPools(1);
    expect(pools).toHaveLength(1);
    const p = pools[0];
    expect(p).toMatchObject<Pool>({
      id: '1',
      tokenSymbols: ['AAA','BBB'],
      tvl: 1000,
      volume24h: 200,
      apy: 5,
      farmApy: 2.5,
      totalApy: 7.5,
    });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/pool/search?type=classic&sort=tvl&limit=1')
    );
  });
});
