import type { MarketStatus, OracleStatus, SettlementStatus } from "@/types/enums";

export interface ResolutionEvent {
  id: string;
  marketId: string;
  title: string;
  status: "completed" | "current" | "pending";
  timestamp?: string;
  details: string;
}

export interface ResolutionState {
  marketId: string;
  marketStatus: MarketStatus;
  oracleStatus: OracleStatus;
  settlementStatus: SettlementStatus;
  winningOutcome?: "YES" | "NO";
  timeline: ResolutionEvent[];
}
