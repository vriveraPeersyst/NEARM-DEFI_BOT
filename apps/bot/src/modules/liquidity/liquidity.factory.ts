// apps/bot/src/modules/liquidity/liquidity.factory.ts

import { LiquidityService } from './liquidity.service';
import { LiquidityController } from './liquidity.controller';

export function createLiquidityModule() {
  const service = new LiquidityService();
  const controller = new LiquidityController(service);
  return { service, controller };
}
