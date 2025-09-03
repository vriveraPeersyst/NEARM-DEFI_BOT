# Sample Output for Lend & Borrow TL;DR

## Discord Message Preview

```markdown
# 🏦・Lend & Borrow TL;DR

**Welcome! All lending data below is updated in real-time.**  

Here you can **lend** your assets to earn interest and **borrow** against your collateral.

- **Total Supplied:** **$150,964,070.62**  
- **Total Borrowed:** **$91,261,310.04**  
- **Available Liquidity:** **$1,513,141.80**  

### 📈 Top Markets by Supplied

| Token | Supplied | Supply APY | Suppliers |
| ----- | -------- | ---------- | --------- |
| [USDC](https://app.burrow.finance/) | $52.48M | 6.13% | 27,329 |
| [USDT](https://app.burrow.finance/) | $47.71M | 5.68% | 23,907 |
| [STNEAR](https://app.burrow.finance/) | $32.96M | 0.00% | 3,245 |
| [NEAR](https://app.burrow.finance/) | $8.45M | 0.00% | 4,158 |

### 💸 Top Markets by Borrowed

| Token | Borrowed | Borrow APY | Borrowers |
| ----- | -------- | ---------- | --------- |
| [USDC](https://app.burrow.finance/) | $43.09M | 9.56% | 4,329 |
| [USDT](https://app.burrow.finance/) | $39.41M | 9.07% | 728 |
| [NEAR](https://app.burrow.finance/) | $4.34M | 0.00% | 465 |
| [STNEAR](https://app.burrow.finance/) | $2.81M | 0.00% | 95 |

### ⚡ Highest Supply APY

| Token | Supplied | Supply APY | Suppliers |
| ----- | -------- | ---------- | --------- |
| [USDT.e](https://app.burrow.finance/) | $744.16K | 9.31% | 129 |
| [USDC.e](https://app.burrow.finance/) | $773.91K | 8.94% | 134 |
| [DAI](https://app.burrow.finance/) | $306.14K | 7.85% | 89 |
| [WBTC](https://app.burrow.finance/) | $1.05M | 6.52% | 287 |

### 🔥 Highest Utilization

| Token | Supplied | Utilization | Available |
| ----- | -------- | ----------- | --------- |
| [USDC](https://app.burrow.finance/) | $52.48M | 82.11% | $9.39M |
| [USDT](https://app.burrow.finance/) | $47.71M | 81.78% | $8.30M |
| [FRAX](https://app.burrow.finance/) | $1.23M | 81.58% | $226.74K |
| [USDT.e](https://app.burrow.finance/) | $744.16K | 79.43% | $153.15K |

> ⭐ **Lending Rewards** and **NEAR Ecosystem Benefits** available!

### ⚠️ Risks
Lending and borrowing carry **liquidation risk**. Monitor your health factor closely.
```

## API Data Transformation

### Raw Burrow API Response (Example for USDT):
```json
{
  "borrowed_balance": "39408714085578168152348648",
  "supplied_balance": "47707089811756761377710839", 
  "token_supplied_value": "47707089.81175676",
  "token_borrowed_value": "39408714.085578166",
  "token_supply_apr": "0.0552313554",
  "token_borrow_apr": "0.0891487172",
  "total_suppliers": 23907,
  "total_borrowers": 728,
  "token_utilization_rate": 0.8178098,
  "extra_decimals": 12
}
```

### Transformed to Display Values:
- **Supplied**: $47.71M (from `token_supplied_value`)
- **Borrowed**: $39.41M (from `token_borrowed_value`) 
- **Supply APY**: 5.68% (converted from `token_supply_apr` using compound interest formula)
- **Borrow APY**: 9.07% (converted from `token_borrow_apr` using compound interest formula)
- **Utilization**: 81.78% (from `token_utilization_rate`)
- **Available Liquidity**: $8.30M (calculated as supplied - borrowed - reserved)

### Key Transformations:
1. **APR → APY**: Uses compound interest formula `(1 + APR/365)^365 - 1`
2. **Balance Conversion**: Raw balances divided by `10^extra_decimals`
3. **Token Symbol Mapping**: Contract addresses mapped to readable symbols
4. **Compact Formatting**: Large numbers formatted as 1.23M, 456.78K, etc.
