export interface PortfolioSummary {
  account: `0x${string}`;
  vaultBalance: number;
  portfolioValue: number;
  unrealizedPnl: number;
  realizedPnl?: number;
  usedMargin: number;
  availableMargin: number;
  marginRatio: number;
}
