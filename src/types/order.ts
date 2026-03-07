import type { OrderSide, OrderType, OutcomeSide } from "@/types/enums";

export interface OrderbookLevel {
  price: number;
  size: number;
  cumulative: number;
}

export interface Orderbook {
  marketId: string;
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  spreadBps: number;
}

export interface TradePrint {
  id: string;
  marketId: string;
  price: number;
  size: number;
  side: OrderSide;
  outcome: OutcomeSide;
  timestamp: string;
}

export interface Order {
  id: string;
  marketId: string;
  outcome: OutcomeSide;
  side: OrderSide;
  type: OrderType;
  price?: number;
  size: number;
  collateral: number;
  leverage: number;
  feeEstimate: number;
  status: "open" | "filled" | "cancelled" | "partially_filled";
  createdAt: string;
}
