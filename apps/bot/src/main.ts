// apps/bot/src/main.ts
import 'dotenv/config';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import cron from 'node-cron';
import { createLiquidityModule } from './modules/liquidity/liquidity.factory';
import { createLendingModule } from './modules/lending/lending.factory';

async function startBot() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    const liquidityChId = process.env.LIQUIDITY_CHANNEL_ID;
    const lendingChId = process.env.LENDING_CHANNEL_ID || '1358810964933349517';
    
    if (!liquidityChId) {
      console.error('LIQUIDITY_CHANNEL_ID is not set in .env');
      process.exit(1);
    }

    const liquidityChannel = (await client.channels.fetch(liquidityChId)) as TextChannel;
    const lendingChannel = (await client.channels.fetch(lendingChId)) as TextChannel;
    
    if (!liquidityChannel) {
      console.error('Could not find liquidity channel with ID', liquidityChId);
      process.exit(1);
    }
    
    if (!lendingChannel) {
      console.error('Could not find lending channel with ID', lendingChId);
      process.exit(1);
    }

    const { controller: liquidityController } = createLiquidityModule();
    const { controller: lendingController } = createLendingModule();

    // 1) Initial post/update for both modules
    await liquidityController.postOrUpdate(liquidityChannel);
    await lendingController.postOrUpdate(lendingChannel);

    // 2) Schedule every 30 minutes
    //    ┌──────── minute (0–59)
    //    │ ┌────── hour (0–23)
    //    │ │ ┌──── day of month (1–31)
    //    │ │ │ ┌── month (1–12)
    //    │ │ │ │ ┌─ day of week (0–6) (Sunday=0)
    //    │ │ │ │ │
    //    * * * * *
    cron.schedule('*/30 * * * *', async () => {
      console.log('⏰ Refreshing liquidity and lending stats…');
      try {
        await liquidityController.postOrUpdate(liquidityChannel);
        await lendingController.postOrUpdate(lendingChannel);
        console.log('✅ Liquidity and Lending TL;DR updated');
      } catch (err) {
        console.error('❌ Error updating TL;DR messages', err);
      }
    });
  });

  await client.login(process.env.DISCORD_TOKEN);
}

startBot().catch((err) => {
  console.error('Fatal error starting bot', err);
  process.exit(1);
});