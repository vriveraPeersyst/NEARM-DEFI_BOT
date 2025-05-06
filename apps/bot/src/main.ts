// apps/bot/src/main.ts
import 'dotenv/config';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import cron from 'node-cron';
import { createLiquidityModule } from './modules/liquidity/liquidity.factory';

async function startBot() {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    const chId = process.env.LIQUIDITY_CHANNEL_ID;
    if (!chId) {
      console.error('LIQUIDITY_CHANNEL_ID is not set in .env');
      process.exit(1);
    }

    const channel = (await client.channels.fetch(chId)) as TextChannel;
    if (!channel) {
      console.error('Could not find channel with ID', chId);
      process.exit(1);
    }

    const { controller } = createLiquidityModule();

    // 1) Initial post/update
    await controller.postOrUpdate(channel);

    // 2) Schedule every 30 minutes
    //    ┌──────── minute (0–59)
    //    │ ┌────── hour (0–23)
    //    │ │ ┌──── day of month (1–31)
    //    │ │ │ ┌── month (1–12)
    //    │ │ │ │ ┌─ day of week (0–6) (Sunday=0)
    //    │ │ │ │ │
    //    * * * * *
    cron.schedule('*/30 * * * *', async () => {
      console.log('⏰ Refreshing liquidity stats…');
      try {
        await controller.postOrUpdate(channel);
        console.log('✅ Liquidity TL;DR updated');
      } catch (err) {
        console.error('❌ Error updating liquidity TL;DR', err);
      }
    });
  });

  await client.login(process.env.DISCORD_TOKEN);
}

startBot().catch((err) => {
  console.error('Fatal error starting bot', err);
  process.exit(1);
});