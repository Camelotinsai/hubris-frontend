import { apiGet, sleep } from "@/lib/api/client";
import type { OrdersResponse, PositionsResponse, ShareBalancesResponse } from "@/lib/api/types";
import { env } from "@/lib/env";
import { mockOpenOrders } from "@/lib/api/orderbook";
import type { Order } from "@/types/order";
import type { Position, ShareBalance } from "@/types/position";

const now = Date.now();

const mockPositions: Position[] = [
  {
    id: "pos-01",
    marketId: "btc-150k-2026",
    question: "Will BTC close above $150,000 by Dec 31, 2026?",
    outcome: "YES",
    size: 120_000,
    averageEntry: 0.35,
    markPrice: 0.42,
    leverage: 10,
    collateral: 4_200,
    liquidationPriceEstimate: 0.298,
    unrealizedPnl: 8_400,
    settlementStatus: "open"
  },
  {
    id: "pos-02",
    marketId: "fed-cut-q4-2026",
    question: "Will the Fed cut rates before Q4 2026?",
    outcome: "NO",
    size: 45_000,
    averageEntry: 0.31,
    markPrice: 0.33,
    leverage: 6,
    collateral: 2_325,
    liquidationPriceEstimate: 0.421,
    unrealizedPnl: -900,
    settlementStatus: "open"
  },
  {
    id: "pos-03",
    marketId: "human-proof-leverage-2026",
    question: "Will major exchanges require proof-of-human for all leveraged accounts by Dec 2026?",
    outcome: "YES",
    size: 61_200,
    averageEntry: 0.29,
    markPrice: 0.37,
    leverage: 14,
    collateral: 4_371,
    liquidationPriceEstimate: 0.241,
    unrealizedPnl: 4_896,
    settlementStatus: "open"
  }
];

const mockOrderHistory: Order[] = [
  ...mockOpenOrders,
  {
    id: "ord-11",
    marketId: "fed-cut-q4-2026",
    outcome: "YES",
    side: "BUY",
    type: "MARKET",
    size: 32_500,
    collateral: 3_250,
    leverage: 10,
    feeEstimate: 6.3,
    status: "filled",
    createdAt: new Date(now - 86_400_000).toISOString()
  },
  {
    id: "ord-12",
    marketId: "senate-majority-2026",
    outcome: "NO",
    side: "BUY",
    type: "LIMIT",
    price: 0.68,
    size: 20_000,
    collateral: 2_857,
    leverage: 7,
    feeEstimate: 2.8,
    status: "cancelled",
    createdAt: new Date(now - 172_800_000).toISOString()
  }
];

const mockShareBalances: ShareBalance[] = [
  {
    marketId: "btc-150k-2026",
    question: "Will BTC close above $150,000 by Dec 31, 2026?",
    yesShares: 11_233,
    noShares: 0
  },
  {
    marketId: "fed-cut-q4-2026",
    question: "Will the Fed cut rates before Q4 2026?",
    yesShares: 0,
    noShares: 4_882
  },
  {
    marketId: "human-proof-leverage-2026",
    question: "Will major exchanges require proof-of-human for all leveraged accounts by Dec 2026?",
    yesShares: 2_140,
    noShares: 0
  }
];

async function fallbackPositions(): Promise<PositionsResponse> {
  await sleep(150);
  return { data: mockPositions };
}

async function fallbackHistory(): Promise<OrdersResponse> {
  await sleep(150);
  return { data: mockOrderHistory };
}

async function fallbackShares(): Promise<ShareBalancesResponse> {
  await sleep(120);
  return { data: mockShareBalances };
}

export async function fetchPositions(): Promise<Position[]> {
  const response = await apiGet<PositionsResponse>(`${env.endpoints.positions}`, fallbackPositions);
  return response.data;
}

export async function fetchOrderHistory(): Promise<Order[]> {
  const response = await apiGet<OrdersResponse>(`${env.endpoints.orders}/history`, fallbackHistory);
  return response.data;
}

export async function fetchShareBalances(): Promise<ShareBalance[]> {
  const response = await apiGet<ShareBalancesResponse>(`${env.endpoints.shares}/balances`, fallbackShares);
  return response.data;
}
