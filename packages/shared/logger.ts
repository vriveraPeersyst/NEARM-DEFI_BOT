// packages/shared/logger.ts

import axios from 'axios';

const WEBHOOK_URL = process.env.BOT_LOGS_WEBHOOK_URL;

// Helper to send to Discord webhook (if configured)
async function sendToDiscord(level: string, message: string, meta: unknown[]) {
  if (!WEBHOOK_URL) return;
  try {
    // Discord webhook expects a JSON payload with `content`
    const contentLines = [
      `**[${level}]** ${message}`,
      ...meta.map(m => '```json\n' + JSON.stringify(m, null, 2) + '\n```')
    ];
    await axios.post(WEBHOOK_URL, { content: contentLines.join('\n') });
  } catch (err) {
    // If webhook fails, still surface error in console
    console.error(
      `[LOGGER] Failed to send ${level} log to Discord webhook`,
      err
    );
  }
}

export function info(message: string, ...meta: unknown[]) {
  const timestamp = new Date().toISOString();
  console.info(`[INFO]  ${timestamp}  ${message}`, ...meta);
  sendToDiscord('INFO', message, meta);
}

export function warn(message: string, ...meta: unknown[]) {
  const timestamp = new Date().toISOString();
  console.warn(`[WARN]  ${timestamp}  ${message}`, ...meta);
  sendToDiscord('WARN', message, meta);
}

export function error(message: string, ...meta: unknown[]) {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR] ${timestamp}  ${message}`, ...meta);
  sendToDiscord('ERROR', message, meta);
}
