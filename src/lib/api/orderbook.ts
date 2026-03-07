import { apiGet, sleep } from "@/lib/api/client";
import type { OrdersResponse, OrderbookResponse, RecentTradesResponse } from "@/lib/api/types";
import { env } from "@/lib/env";
import type { Order, Orderbook, TradePrint } from "@/types/order";

const mockOrderbooks: Record<string, Orderbook> = {
  "btc-150k-2026": {
    marketId: "btc-150k-2026",
    spreadBps: 43,
    bids: [
      { price: 0.41, size: 120_000, cumulative: 120_000 },
      { price: 0.405, size: 96_000, cumulative: 216_000 },
      { price: 0.402, size: 60_000, cumulative: 276_000 },
      { price: 0.398, size: 44_500, cumulative: 320_500 }
    ],
    asks: [
      { price: 0.42, size: 103_000, cumulative: 103_000 },
      { price: 0.425, size: 88_000, cumulative: 191_000 },
      { price: 0.431, size: 70_000, cumulative: 261_000 },
      { price: 0.438, size: 59_000, cumulative: 320_000 }
    ]
  }
};

const now = new Date();

const mockTrades: Record<string, TradePrint[]> = {
  "btc-150k-2026": [
    {
      id: "t1",
      marketId: "btc-150k-2026",
      price: 0.42,
      size: 12_000,
      side: "BUY",
      outcome: "YES",
      timestamp: new Date(now.getTime() - 4 * 60_000).toISOString()
    },
    {
      id: "t2",
      marketId: "btc-150k-2026",
      price: 0.417,
      size: 8_400,
      side: "SELL",
      outcome: "NO",
      timestamp: new Date(now.getTime() - 8 * 60_000).toISOString()
    },
    {
      id: "t3",
      marketId: "btc-150k-2026",
      price: 0.422,
      size: 17_000,
      side: "BUY",
      outcome: "YES",
      timestamp: new Date(now.getTime() - 14 * 60_000).toISOString()
    }
  ]
};

const mockOpenOrders: Order[] = [
  {
    id: "ord-01",
    marketId: "btc-150k-2026",
    outcome: "YES",
    side: "BUY",
    type: "LIMIT",
    price: 0.409,
    size: 24_000,
    collateral: 2_400,
    leverage: 10,
    feeEstimate: 3.6,
    status: "open",
    createdAt: new Date(now.getTime() - 32 * 60_000).toISOString()
  },
  {
    id: "ord-02",
    marketId: "eth-etf-inflows",
    outcome: "NO",
    side: "SELL",
    type: "LIMIT",
    price: 0.476,
    size: 15_000,
    collateral: 1_875,
    leverage: 8,
    feeEstimate: 2.1,
    status: "partially_filled",
    createdAt: new Date(now.getTime() - 76 * 60_000).toISOString()
  },
  {
    id: "ord-03",
    marketId: "human-proof-leverage-2026",
    outcome: "YES",
    side: "BUY",
    type: "LIMIT",
    price: 0.365,
    size: 28_000,
    collateral: 2_000,
    leverage: 14,
    feeEstimate: 1.9,
    status: "open",
    createdAt: new Date(now.getTime() - 104 * 60_000).toISOString()
  }
];

async function fallbackOrderbook(marketId: string): Promise<OrderbookResponse> {
  await sleep(120);
  return { data: mockOrderbooks[marketId] ?? { marketId, bids: [], asks: [], spreadBps: 0 } };
}

async function fallbackTrades(marketId: string): Promise<RecentTradesResponse> {
  await sleep(120);
  return { data: mockTrades[marketId] ?? [] };
}

async function fallbackOpenOrders(): Promise<OrdersResponse> {
  await sleep(120);
  return { data: mockOpenOrders };
}

export async function fetchOrderbook(marketId: string): Promise<Orderbook> {
  const response = await apiGet<OrderbookResponse>(
    `${env.endpoints.markets}/${marketId}/orderbook`,
    () => fallbackOrderbook(marketId)
  );
  return response.data;
}

export async function fetchRecentTrades(marketId: string): Promise<TradePrint[]> {
  const response = await apiGet<RecentTradesResponse>(
    `${env.endpoints.markets}/${marketId}/trades`,
    () => fallbackTrades(marketId)
  );
  return response.data;
}

export async function fetchOpenOrders(): Promise<Order[]> {
  const response = await apiGet<OrdersResponse>(`${env.endpoints.orders}/open`, fallbackOpenOrders);
  return response.data;
}

export { mockOpenOrders };
