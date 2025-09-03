// apps/bot/src/modules/lending/types.ts

export interface LendingToken {
  tokenName: string;
  symbol: string;
  tokenSuppliedValue: number;
  tokenBorrowedValue: number;
  availableLiquidity: number;
  supplyApy: number;
  borrowApy: number;
  totalSuppliers: number;
  totalBorrowers: number;
  utilizationRate: number;
  tokenSupplyApr: number;
  tokenBorrowApr: number;
  tokenFarmSupplyApr: number;
  tokenFarmBorrowApr: number;
}

export interface LendingStats {
  totalSupplied: number;
  totalBorrowed: number;
  totalAvailableLiquidity: number;
}

export interface BurrowApiResponse {
  borrowed_balance: string;
  can_deposit: boolean;
  total_suppliers: number;
  prot_ratio: number;
  reserved: string;
  can_withdraw: boolean;
  total_borrowers: number;
  prot_fee: string;
  reserve_ratio: number;
  can_use_as_collateral: boolean;
  createdAt: string;
  token_farm_supply_apr: string;
  token_name: string;
  target_utilization: number;
  can_borrow: boolean;
  token_supply_apr: string;
  token_farm_borrow_apr: string;
  id: number;
  target_utilization_rate: string;
  net_tvl_multiplier: number;
  token_supply_fee: string;
  supplied_shares: string;
  max_utilization_rate: string;
  token_supplied_value: string;
  token_borrow_apr: string;
  token_borrow_fee: string;
  supplied_balance: string;
  volatility_ratio: number;
  token_borrowed_value: string;
  net_liquidity_apr: string;
  borrowed_shares: string;
  extra_decimals: number;
  token_utilization_rate: number;
}
