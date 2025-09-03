// scripts/test-time-formatting.ts

import { formatTimeAgo } from '../apps/bot/src/modules/liquidity/utils';

function testTimeFormatting() {
  console.log('🕒 Testing Relative Time Formatting...\n');
  
  const now = new Date();
  
  // Test different time intervals
  const testCases = [
    { label: 'Just now', date: new Date(now.getTime()) },
    { label: '30 seconds ago', date: new Date(now.getTime() - 30 * 1000) },
    { label: '1 minute ago', date: new Date(now.getTime() - 1 * 60 * 1000) },
    { label: '5 minutes ago', date: new Date(now.getTime() - 5 * 60 * 1000) },
    { label: '30 minutes ago', date: new Date(now.getTime() - 30 * 60 * 1000) },
    { label: '1 hour ago', date: new Date(now.getTime() - 1 * 60 * 60 * 1000) },
    { label: '3 hours ago', date: new Date(now.getTime() - 3 * 60 * 60 * 1000) },
    { label: '1 day ago', date: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
    { label: '3 days ago', date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
  ];
  
  testCases.forEach(testCase => {
    const formatted = formatTimeAgo(testCase.date);
    console.log(`${testCase.label.padEnd(20)} → "${formatted}"`);
  });
  
  console.log('\n✅ Time formatting test completed!');
  console.log('\n📝 Example Discord messages will show:');
  console.log('  - "Last updated: just now" (when data was just fetched)');
  console.log('  - "Last updated: 2 minutes ago" (after 2 minutes)');
  console.log('  - "Last updated: 1 hour ago" (after 1 hour)');
  console.log('  - "Last updated: 2 days ago" (if bot was down for 2 days)');
}

testTimeFormatting();
