import type { OutcomeSide, SettlementStatus } from "@/types/enums";

export interface Position {
  id: string;
  marketId: string;
  question: string;
  outcome: OutcomeSide;
  size: number;
  averageEntry: number;
  markPrice: number;
  leverage: number;
  collateral: number;
  liquidationPriceEstimate: number;
  unrealizedPnl: number;
  settlementStatus: SettlementStatus;
}

export interface ShareBalance {
  marketId: string;
  question: string;
  yesShares: number;
  noShares: number;
}
