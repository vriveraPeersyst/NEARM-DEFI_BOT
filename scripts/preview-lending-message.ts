// scripts/preview-lending-message.ts

import { createLendingModule } from '../apps/bot/src/modules/lending/lending.factory';

async function previewLendingMessage() {
  console.log('🏦 Generating Lending TL;DR Message Preview...\n');
  
  const { service, controller } = createLendingModule();
  
  try {
    // Get the data
    const stats = await service.getGlobalStats();
    const [bySupplied, byBorrowed, bySupplyApy, byUtilization] = await Promise.all([
      service.getTopTokensBySupplied(4),
      service.getTopTokensByBorrowed(4),
      service.getTopTokensBySupplyApy(4),
      service.getTopTokensByUtilization(4),
    ]);

    // Use the public buildContent method
    const message = controller.buildContent(stats, bySupplied, byBorrowed, bySupplyApy, byUtilization);
    
    console.log('📋 Generated Discord Message:');
    console.log('=' .repeat(80));
    console.log(message);
    console.log('=' .repeat(80));
    console.log('\n✅ Message preview generated successfully!');
    console.log('\nThis message would be posted to channel ID: 1358810964933349517');
    console.log('And refreshed every 30 minutes automatically.');
    
  } catch (error) {
    console.error('❌ Error generating message preview:', error);
  }
}

previewLendingMessage();
