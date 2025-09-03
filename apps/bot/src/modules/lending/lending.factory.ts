// apps/bot/src/modules/lending/lending.factory.ts

import { LendingService } from './lending.service';
import { LendingController } from './lending.controller';

export function createLendingModule() {
  const service = new LendingService();
  const controller = new LendingController(service);
  return { service, controller };
}
