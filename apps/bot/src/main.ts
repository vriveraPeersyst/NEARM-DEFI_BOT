// apps/bot/src/main.ts

import 'dotenv/config';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { createLiquidityModule } from './modules/liquidity/liquidity.factory';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  const chId = process.env.LIQUIDITY_CHANNEL_ID;
  if (!chId) {
    console.error('LIQUIDITY_CHANNEL_ID is not set in .env');
    return;
  }
  const channel = (await client.channels.fetch(chId)) as TextChannel;
  if (!channel) {
    console.error('Could not find channel with ID', chId);
    return;
  }

  const { controller } = createLiquidityModule();
  await controller.postOrUpdate(channel);
});

client.login(process.env.DISCORD_TOKEN);
