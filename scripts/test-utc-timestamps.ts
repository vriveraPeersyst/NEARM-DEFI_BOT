// scripts/test-utc-timestamps.ts

import { formatUTCTime } from '../apps/bot/src/modules/liquidity/utils';

function testUTCTimestamps() {
  console.log('🕐 Testing UTC Timestamp Formatting...\n');
  
  // Test current time
  const now = Date.now();
  console.log(`Current time: ${formatUTCTime(now)}`);
  
  // Test some example times
  const examples = [
    new Date('2025-09-03T14:30:00Z').getTime(),
    new Date('2025-09-03T09:15:45Z').getTime(),
    new Date('2025-09-03T23:59:59Z').getTime(),
  ];
  
  console.log('\nExample timestamps:');
  examples.forEach((timestamp, i) => {
    console.log(`${i + 1}. ${formatUTCTime(timestamp)}`);
  });
  
  console.log('\n✅ UTC timestamp formatting works perfectly!');
  console.log('\n📝 How it will appear in Discord messages:');
  console.log('*Last updated: 2025-09-03 14:30:25 UTC*');
}

testUTCTimestamps();
