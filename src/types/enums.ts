export type MarketCategory =
  | "Trending"
  | "Crypto"
  | "Politics"
  | "Sports"
  | "Tech"
  | "Economy"
  | "Culture";

export type MarketStatus = "active" | "paused" | "resolved" | "cancelled";

export type OracleStatus = "pending" | "verifying" | "verified" | "disputed";

export type OutcomeSide = "YES" | "NO";

export type OrderSide = "BUY" | "SELL";

export type OrderType = "MARKET" | "LIMIT";

export type SettlementStatus = "open" | "awaiting_settlement" | "settled";
