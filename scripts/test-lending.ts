// scripts/test-lending.ts

import { createLendingModule } from '../apps/bot/src/modules/lending/lending.factory';
import { formatCurrency, formatPercent } from '../apps/bot/src/modules/lending/utils';

async function testLending() {
  console.log('🧪 Testing Lending Module...');
  
  const { service, controller } = createLendingModule();
  
  try {
    // Test global stats
    console.log('\n📊 Fetching global stats...');
    const stats = await service.getGlobalStats();
    console.log(`Total Supplied: $${formatCurrency(stats.totalSupplied)}`);
    console.log(`Total Borrowed: $${formatCurrency(stats.totalBorrowed)}`);
    console.log(`Available Liquidity: $${formatCurrency(stats.totalAvailableLiquidity)}`);
    
    // Test top tokens by supplied
    console.log('\n🏆 Top 3 tokens by supplied value...');
    const topSupplied = await service.getTopTokensBySupplied(3);
    topSupplied.forEach((token, i) => {
      console.log(`${i + 1}. ${token.symbol}: $${formatCurrency(token.tokenSuppliedValue)} (${formatPercent(token.supplyApy * 100)}% APY)`);
    });
    
    // Test top tokens by supply APY
    console.log('\n⚡ Top 3 tokens by supply APY...');
    const topApy = await service.getTopTokensBySupplyApy(3);
    topApy.forEach((token, i) => {
      console.log(`${i + 1}. ${token.symbol}: ${formatPercent(token.supplyApy * 100)}% APY ($${formatCurrency(token.tokenSuppliedValue)} supplied)`);
    });
    
    // Test utilization rates
    console.log('\n🔥 Top 3 tokens by utilization...');
    const topUtilization = await service.getTopTokensByUtilization(3);
    topUtilization.forEach((token, i) => {
      console.log(`${i + 1}. ${token.symbol}: ${formatPercent(token.utilizationRate * 100)}% utilized`);
    });
    
    console.log('\n✅ All tests passed!');
    
    // Test Discord message generation
    console.log('\n📋 Testing Discord Message Generation...');
    const [bySupplied, byBorrowed, bySupplyApy, byUtilization] = await Promise.all([
      service.getTopTokensBySupplied(4),
      service.getTopTokensByBorrowed(4),
      service.getTopTokensBySupplyApy(4),
      service.getTopTokensByUtilization(4),
    ]);

    // Generate message content
    const content = (controller as any).buildContent(stats, bySupplied, byBorrowed, bySupplyApy, byUtilization);
    
    console.log('\n📋 Generated Discord Message Preview:');
    console.log('=' .repeat(60));
    console.log(content);
    console.log('=' .repeat(60));
    
    // Show the URLs that will be generated
    console.log('\n🔗 Example Rhea Finance URLs:');
    const tokens = await service.getAllTokensData();
    tokens.slice(0, 3).forEach(token => {
      console.log(`${token.symbol}: https://app.rhea.finance/tokenDetail/${token.tokenName}?pageType=main`);
    });
    
  } catch (error) {
    console.error('❌ Error testing lending module:', error);
  }
}

testLending();
