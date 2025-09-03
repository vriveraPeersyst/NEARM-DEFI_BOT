// apps/bot/src/modules/lending/lending.controller.ts

import { TextChannel, Message } from 'discord.js';
import { LendingService } from './lending.service';
import { formatCurrency, formatPercent, formatCompactCurrency, formatUTCTime } from './utils';
import { LendingToken } from './types';

export class LendingController {
  private readonly messageTag = '# :bank:・Lend & Borrow TL;DR';
  private lastUpdateTime: Date = new Date();

  constructor(private readonly service: LendingService) {}

  /** Generate the correct Rhea Lending URL for a token */
  private getTokenUrl(tokenName: string): string {
    return `https://app.rhea.finance/lending/tokenDetail/${tokenName}?pageType=main`;
  }

  /** Renders a Markdown table for a list of lending tokens */
  private buildLendingTable(tokens: LendingToken[], tableType: 'supply' | 'borrow' | 'utilization'): string[] {
    const lines: string[] = [];
    
    switch (tableType) {
      case 'supply':
        lines.push('| Token | Supplied | Supply APY | Suppliers |');
        lines.push('| ----- | -------- | ---------- | --------- |');
        for (const token of tokens) {
          lines.push(
            `| [${token.symbol}](${this.getTokenUrl(token.tokenName)}) | ` +
            `$${formatCompactCurrency(token.tokenSuppliedValue)} | ` +
            `${formatPercent(token.supplyApy * 100)}% | ` +
            `${token.totalSuppliers.toLocaleString()} |`
          );
        }
        break;
        
      case 'borrow':
        lines.push('| Token | Borrowed | Borrow APY | Borrowers |');
        lines.push('| ----- | -------- | ---------- | --------- |');
        for (const token of tokens) {
          lines.push(
            `| [${token.symbol}](${this.getTokenUrl(token.tokenName)}) | ` +
            `$${formatCompactCurrency(token.tokenBorrowedValue)} | ` +
            `${formatPercent(token.borrowApy * 100)}% | ` +
            `${token.totalBorrowers.toLocaleString()} |`
          );
        }
        break;
        
      case 'utilization':
        lines.push('| Token | Supplied | Utilization | Available |');
        lines.push('| ----- | -------- | ----------- | --------- |');
        for (const token of tokens) {
          lines.push(
            `| [${token.symbol}](${this.getTokenUrl(token.tokenName)}) | ` +
            `$${formatCompactCurrency(token.tokenSuppliedValue)} | ` +
            `${formatPercent(token.utilizationRate * 100)}% | ` +
            `$${formatCompactCurrency(token.availableLiquidity)} |`
          );
        }
        break;
    }
    
    return lines;
  }

  /**
   * Builds the full message content including:
   *  - Global stats
   *  - Top by Supply APY (reduced to 3)
   *  - Top by Utilization (reduced to 3)
   */
  public buildContent(
    stats: { totalSupplied: number; totalBorrowed: number; totalAvailableLiquidity: number },
    bySupplied: LendingToken[],
    byBorrowed: LendingToken[],
    bySupplyApy: LendingToken[],
    byUtilization: LendingToken[]
  ): string {
    const lines: string[] = [];
    lines.push(this.messageTag);
    lines.push('');
    lines.push(`*Last updated: ${formatUTCTime(this.lastUpdateTime.getTime())}*`);
    lines.push('');
    lines.push('**Welcome! All lending data below is updated in real-time.**  ');
    lines.push('');
    lines.push(
      'Here you can **lend** your assets to earn interest and **borrow** against your collateral on [Rhea Lending](https://app.rhea.finance/lending).'
    );
    lines.push('');
    lines.push(`- **Total Supplied:** **$${formatCompactCurrency(stats.totalSupplied)}**  `);
    lines.push(`- **Total Borrowed:** **$${formatCompactCurrency(stats.totalBorrowed)}**  `);
    lines.push(`- **Available Liquidity:** **$${formatCompactCurrency(stats.totalAvailableLiquidity)}**  `);
    lines.push('');

    lines.push('### :chart_with_upwards_trend: Top Markets by Supplied');
    lines.push(...this.buildLendingTable(bySupplied, 'supply'));
    lines.push('');

    lines.push('### :zap: Highest Supply APY');
    lines.push(...this.buildLendingTable(bySupplyApy, 'supply'));
    lines.push('');

    lines.push('> :star2: **Lending Rewards** available on [Rhea Lending!](https://app.rhea.finance/lending)');

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
   * to include lending and borrowing data tables.
   */
  async postOrUpdate(channel: TextChannel): Promise<void> {
    this.lastUpdateTime = new Date(); // Update the timestamp when fetching new data
    
    const stats = await this.service.getGlobalStats();
    const [bySupplied, bySupplyApy] = await Promise.all([
      this.service.getTopTokensBySupplied(4),
      this.service.getTopTokensBySupplyApy(4),
    ]);

    const content = this.buildContent(stats, bySupplied, [], bySupplyApy, []);
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
