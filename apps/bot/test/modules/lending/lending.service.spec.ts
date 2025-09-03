// apps/bot/test/modules/lending/lending.service.spec.ts

import { LendingService } from '../../../src/modules/lending/lending.service';

describe('LendingService', () => {
  let service: LendingService;

  beforeEach(() => {
    service = new LendingService();
  });

  describe('getGlobalStats', () => {
    it('should return global lending statistics', async () => {
      const stats = await service.getGlobalStats();
      
      expect(stats).toBeDefined();
      expect(typeof stats.totalSupplied).toBe('number');
      expect(typeof stats.totalBorrowed).toBe('number');
      expect(typeof stats.totalAvailableLiquidity).toBe('number');
      expect(stats.totalSupplied).toBeGreaterThan(0);
    }, 30000); // 30 second timeout for API calls
  });

  describe('getAllTokensData', () => {
    it('should return lending data for all tokens', async () => {
      const tokens = await service.getAllTokensData();
      
      expect(Array.isArray(tokens)).toBe(true);
      expect(tokens.length).toBeGreaterThan(0);
      
      // Check that USDT is included
      const usdt = tokens.find(token => token.symbol === 'USDT');
      expect(usdt).toBeDefined();
      
      if (usdt) {
        expect(typeof usdt.tokenSuppliedValue).toBe('number');
        expect(typeof usdt.tokenBorrowedValue).toBe('number');
        expect(typeof usdt.supplyApy).toBe('number');
        expect(typeof usdt.borrowApy).toBe('number');
        expect(typeof usdt.totalSuppliers).toBe('number');
        expect(typeof usdt.totalBorrowers).toBe('number');
        expect(usdt.tokenSuppliedValue).toBeGreaterThan(0);
      }
    }, 30000);
  });

  describe('getTopTokensBySupplied', () => {
    it('should return top tokens sorted by supplied value', async () => {
      const tokens = await service.getTopTokensBySupplied(3);
      
      expect(Array.isArray(tokens)).toBe(true);
      expect(tokens.length).toBeLessThanOrEqual(3);
      
      // Check that they are sorted by supplied value (descending)
      for (let i = 0; i < tokens.length - 1; i++) {
        expect(tokens[i].tokenSuppliedValue).toBeGreaterThanOrEqual(
          tokens[i + 1].tokenSuppliedValue
        );
      }
    }, 30000);
  });

  describe('getTopTokensBySupplyApy', () => {
    it('should return top tokens sorted by supply APY', async () => {
      const tokens = await service.getTopTokensBySupplyApy(3);
      
      expect(Array.isArray(tokens)).toBe(true);
      
      // Check that they are sorted by supply APY (descending)
      for (let i = 0; i < tokens.length - 1; i++) {
        expect(tokens[i].supplyApy).toBeGreaterThanOrEqual(
          tokens[i + 1].supplyApy
        );
      }
      
      // All should have positive APY
      tokens.forEach(token => {
        expect(token.supplyApy).toBeGreaterThan(0);
      });
    }, 30000);
  });
});
