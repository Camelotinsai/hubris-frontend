import type { MarketCategory, MarketStatus, OracleStatus, OutcomeSide } from "@/types/enums";

export type MarketAccessFilter = "all" | "human-only" | "standard";

export interface MarketPrice {
  yes: number;
  no: number;
}

export interface MarketStats {
  volume24h?: number;
  openInterest?: number;
  tradedNotional?: number;
  fundingRateBps?: number;
}

export interface Market {
  id: string;
  address: `0x${string}`;
  question: string;
  imageUrl?: string;
  imageAlt?: string;
  groupQuestion?: string;
  outcomeGroupId?: string;
  outcomeBandLabel?: string;
  outcomeBandOrder?: number;
  category: MarketCategory;
  status: MarketStatus;
  oracleStatus: OracleStatus;
  resolutionTime: string;
  prices: MarketPrice;
  leverageCap: number;
  humanOnly?: boolean;
  feeRate?: number;
  feeDiscountPct?: number;
  stats: MarketStats;
  lastTradedOutcome: OutcomeSide;
}

export interface MarketFilter {
  category?: MarketCategory;
  status?: MarketStatus;
  search?: string;
  access?: Exclude<MarketAccessFilter, "all">;
}
