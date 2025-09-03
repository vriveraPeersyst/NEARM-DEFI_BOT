// apps/bot/src/modules/liquidity/liquidity.controller.ts

import { TextChannel, Message } from 'discord.js';
import { LiquidityService } from './liquidity.service';
import { formatCurrency, formatPercent, formatUTCTime } from './utils';
import { Pool } from './types';

export class LiquidityController {
  private readonly messageTag = '# :ocean:・Liquidity Pools TL;DR';
  private lastUpdateTime: Date = new Date();

  constructor(private readonly service: LiquidityService) {}

  /** Renders a Markdown table for a list of pools */
  private buildPoolTable(pools: Pool[]): string[] {
    const lines: string[] = [];
    lines.push('| Pool | TVL | Volume (24h) | APR |');
    lines.push('| ---- | --- | ------------ | --- |');
    for (const p of pools) {
      const combo = p.tokenSymbols.join('-');
      lines.push(
        `| [${combo}](https://dex.rhea.finance/pool/${p.id}) | ` +
          `$${formatCurrency(p.tvl)} | ` +
          `$${formatCurrency(p.volume24h)} | ` +
          `+${formatPercent(p.totalApy)}% |`
      );
    }
    return lines;
  }

  /**
   * Builds the full message content including:
   *  - Global stats
   *  - Top by TVL
   *  - Top by 24h volume
   *  - Top by APY
   */
  private buildContent(
    stats: { tvl: number; volume24h: number },
    byTvl: Pool[],
    byVol: Pool[],
    byApy: Pool[]
  ): string {
    const lines: string[] = [];
    lines.push(this.messageTag);
    lines.push('');
    lines.push(`*Last updated: ${formatUTCTime(this.lastUpdateTime.getTime())}*`);
    lines.push('');
    lines.push('**Welcome! All data below is updated in real-time.**  ');
    lines.push('');
    lines.push(
      'Here you can provide liquidity and **earn** — all through liquidity pools.'
    );
    lines.push('');
    lines.push(`- **TVL:** **$${formatCurrency(stats.tvl)}**  `);
    lines.push(`- **24h Volume:** **$${formatCurrency(stats.volume24h)}**  `);
    lines.push('');

    lines.push('### :bar_chart: Top Pools by TVL');
    lines.push(...this.buildPoolTable(byTvl));
    lines.push('');

    lines.push('### :chart_with_upwards_trend: Top Pools by 24h Volume');
    lines.push(...this.buildPoolTable(byVol));
    lines.push('');

    lines.push('### :zap: Top Pools by APY');
    lines.push(...this.buildPoolTable(byApy));
    lines.push('');

    lines.push('> :jigsaw: **Boosted Farms** and **Reward Points** available!');
    lines.push('');
    lines.push('### :warning: Risks');
    lines.push('Providing liquidity carries **Impermanent Loss (IL)** risk.');

    return lines.join('\n');
  }

  /** Locate an existing pinned TL;DR message (if any) */
  private async findPinnedTLDR(channel: TextChannel): Promise<Message | null> {
    const pinned = await channel.messages.fetchPinned();
    return (
      pinned.find(
        (msg) =>
          msg.author.id === channel.client.user?.id &&
          msg.content.startsWith(this.messageTag)
      ) ?? null
    );
  }

  /**
   * Posts a new message or edits the existing pinned one
   * to include TVL, Volume, and APY tables.
   */
  async postOrUpdate(channel: TextChannel): Promise<void> {
    this.lastUpdateTime = new Date(); // Update the timestamp when fetching new data
    
    const stats = await this.service.getGlobalStats();
    const [byTvl, byVol, byApy] = await Promise.all([
      this.service.getTopPoolsByTvl(4),
      this.service.getTopPoolsByVolume(4),
      this.service.getTopPoolsByApy(4),
    ]);

    const content = this.buildContent(stats, byTvl, byVol, byApy);
    const existing = await this.findPinnedTLDR(channel);

    if (existing) {
      await existing.edit(content);
    } else {
      const msg = await channel.send(content);
      try {
        await msg.pin();
      } catch {
        // Ensure bot has "Manage Messages"/"Pin Messages" permission
      }
    }
  }
}
