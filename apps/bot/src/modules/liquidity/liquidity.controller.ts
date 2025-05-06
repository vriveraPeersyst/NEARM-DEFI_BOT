// apps/bot/src/modules/liquidity/liquidity.controller.ts

import { TextChannel, Message } from 'discord.js';
import { LiquidityService } from './liquidity.service';
import { formatCurrency, formatPercent } from './utils';
import { Pool } from './types'; // Ensure this path points to where Pool is defined

export class LiquidityController {
  private readonly messageTag = '# :ocean:・Liquidity Pools TL;DR';

  constructor(private readonly service: LiquidityService) {}

  /** Build the TL;DR payload */
  private buildContent(
    stats: { tvl: number; volume24h: number },
    pools: Pool[]
  ): string {
    const lines: string[] = [];
    lines.push(this.messageTag);
    lines.push('');
    lines.push('**Welcome to Rhea Finance on NEAR!**  ');
    lines.push(
      'Here you can **Trade, Earn, Bridge**, and soon **Lend** — all through liquidity pools.'
    );
    lines.push('');
    lines.push(`- **TVL:** **$${formatCurrency(stats.tvl)}**  `);
    lines.push(`- **24h Volume:** **$${formatCurrency(stats.volume24h)}**  `);
    lines.push('');
    lines.push('### :person_swimming: Pool Types');
    lines.push('- **Classic:** Uniswap v2 style pairs');
    lines.push('- **Stable:** Curve’s stable asset pools');
    lines.push('- **Degen:** High-risk, high-reward pools');
    lines.push('- **DCL:** Concentrated liquidity for pros');
    lines.push('- **Watchlist:** Save your favorite pools');
    lines.push('');
    lines.push('### :star2: Top Pools Today');
    lines.push('| Pool | TVL | Volume (24h) | APR |');
    lines.push('| ---- | ---- | ---- | ---- |');
    pools.forEach((p) => {
      const name = p.tokenSymbols.join('-');
      lines.push(
        `| [${name}](https://app.ref.finance/pool/${p.id}) | ` +
          `$${formatCurrency(p.tvl)} | ` +
          `$${formatCurrency(p.volume24h)} | ` +
          `+${formatPercent(p.totalApy)}% |`
      );
    });
    lines.push('');
    lines.push('> :jigsaw: **Boosted Farms** and **Reward Points** available!');
    lines.push('');
    lines.push('### :warning: Risks');
    lines.push('Providing liquidity carries **Impermanent Loss (IL)** risk.');
    return lines.join('\n');
  }

  /** Look for an existing pinned TL;DR message */
  private async findPinnedTLDR(channel: TextChannel): Promise<Message | null> {
    const pinned = await channel.messages.fetchPinned();
    const existing = pinned.find(
      (msg) =>
        msg.author.id === channel.client.user?.id &&
        msg.content.startsWith(this.messageTag)
    );
    return existing ?? null;
  }

  /**
   * On each run (including after a restart) we:
   * 1. Fetch global stats + top pools
   * 2. Look for a pinned TL;DR; if found, edit it
   * 3. Otherwise send & pin a fresh one
   */
  async postOrUpdate(channel: TextChannel): Promise<void> {
    const stats = await this.service.getGlobalStats();
    const pools = await this.service.getTopPools(4);
    const content = this.buildContent(stats, pools);

    const existing = await this.findPinnedTLDR(channel);
    if (existing) {
      await existing.edit(content);
    } else {
      const msg = await channel.send(content);
      // Pin it so on next restart we can find it
      try {
        await msg.pin();
      } catch {
        // ensure the bot has the "Manage Messages" / "Pin Messages" permission
      }
    }
  }
}
