// scripts/test-urls.ts

import { createLendingModule } from '../apps/bot/src/modules/lending/lending.factory';

async function testUrls() {
  console.log('🔗 Testing Rhea Finance URLs...');
  
  const { service } = createLendingModule();
  
  try {
    const tokens = await service.getAllTokensData();
    
    console.log('\n📋 Generated URLs for each token:');
    tokens.slice(0, 5).forEach((token) => {
      const url = `https://app.rhea.finance/tokenDetail/${token.tokenName}?pageType=main`;
      console.log(`${token.symbol}: ${url}`);
    });
    
    // Test specific USDT URL
    const usdtUrl = 'https://app.rhea.finance/tokenDetail/usdt.tether-token.near?pageType=main';
    console.log(`\n✅ USDT example URL: ${usdtUrl}`);
    
  } catch (error) {
    console.error('❌ Error testing URLs:', error);
  }
}

testUrls();
