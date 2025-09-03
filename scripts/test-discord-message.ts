// scripts/test-discord-message.ts

import { createLendingModule } from '../apps/bot/src/modules/lending/lending.factory';

async function testDiscordMessage() {
  console.log('💬 Testing Discord Message Generation...');
  
  const { service, controller } = createLendingModule();
  
  try {
    const stats = await service.getGlobalStats();
    const [bySupplied, byBorrowed, bySupplyApy, byUtilization] = await Promise.all([
      service.getTopTokensBySupplied(4),
      service.getTopTokensByBorrowed(4),
      service.getTopTokensBySupplyApy(4),
      service.getTopTokensByUtilization(4),
    ]);

    // Access the private buildContent method by casting to any
    const content = (controller as any).buildContent(stats, bySupplied, byBorrowed, bySupplyApy, byUtilization);
    
    console.log('\n📝 Generated Discord Message:');
    console.log('='.repeat(80));
    console.log(content);
    console.log('='.repeat(80));
    
    console.log('\n✅ Message generated successfully!');
    console.log(`📊 Message length: ${content.length} characters`);
    
  } catch (error) {
    console.error('❌ Error generating Discord message:', error);
  }
}

testDiscordMessage();
