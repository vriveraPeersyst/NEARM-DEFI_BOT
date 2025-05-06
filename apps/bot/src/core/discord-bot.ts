// apps/bot/src/core/discord-bot.ts

import { Client, GatewayIntentBits } from 'discord.js';

/**
 * Creates and returns a configured Discord.js Client.
 */
export function createDiscordClient(): Client {
  return new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });
}
