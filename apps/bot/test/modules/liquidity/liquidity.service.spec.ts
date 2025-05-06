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
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.ref.finance/all-pool-data'
    );
  });

  const listItem = {
    id: '1',
    token_symbols: ['AAA', 'BBB'],
    tvl: '1000',
    volume_24h: '200',
    apy: '5',
    farm_apy: '2.5',
  };

  it('getTopPoolsByTvl returns correct Pool[] with totalApy', async () => {
    const fake = { code: 0, data: { list: [listItem] } };
    mockedAxios.get.mockResolvedValueOnce({ data: fake });

    const pools = await svc.getTopPoolsByTvl(1);
    expect(pools).toHaveLength(1);
    expect(pools[0]).toMatchObject<Pool>({
      id: '1',
      tokenSymbols: ['AAA', 'BBB'],
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

  it('getTopPoolsByVolume returns correct Pool[] with totalApy', async () => {
    const fake = { code: 0, data: { list: [listItem] } };
    mockedAxios.get.mockResolvedValueOnce({ data: fake });

    const pools = await svc.getTopPoolsByVolume(1);
    expect(pools).toHaveLength(1);
    expect(pools[0]).toMatchObject<Pool>({
      id: '1',
      tokenSymbols: ['AAA', 'BBB'],
      tvl: 1000,
      volume24h: 200,
      apy: 5,
      farmApy: 2.5,
      totalApy: 7.5,
    });
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/pool/search?type=classic&sort=24h&limit=1')
    );
  });

  it('getTopPoolsByApy fetches 20 then picks top by totalApy', async () => {
    const fake = { code: 0, data: { list: [listItem] } };
    mockedAxios.get.mockResolvedValueOnce({ data: fake });

    const pools = await svc.getTopPoolsByApy(1);
    expect(pools).toHaveLength(1);
    expect(pools[0]).toMatchObject<Pool>({
      id: '1',
      tokenSymbols: ['AAA', 'BBB'],
      tvl: 1000,
      volume24h: 200,
      apy: 5,
      farmApy: 2.5,
      totalApy: 7.5,
    });
    // note: always requests limit=20 when sorting by apy
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/pool/search?type=classic&sort=apy&limit=20')
    );
  });
});
