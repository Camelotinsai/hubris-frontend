import { apiGet, sleep } from "@/lib/api/client";
import type { MarketDetailResponse, MarketListRequest, MarketsResponse } from "@/lib/api/types";
import { env } from "@/lib/env";
import type { Market } from "@/types/market";

export const mockMarkets: Market[] = [
  {
    id: "btc-150k-2026",
    address: "0xA4E4000000000000000000000000000000000011",
    question: "Will BTC close above $150,000 by Dec 31, 2026?",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Ethereum_%2846501365895%29.jpg/1280px-Ethereum_%2846501365895%29.jpg",
    imageAlt: "Macro close-up of a crypto coin on a circuit board",
    category: "Crypto",
    status: "active",
    oracleStatus: "pending",
    resolutionTime: "2026-12-31T23:00:00.000Z",
    prices: { yes: 0.42, no: 0.58 },
    leverageCap: 12,
    stats: { volume24h: 2_450_000, openInterest: 8_100_000, tradedNotional: 83_000_000, fundingRateBps: 2.4 },
    lastTradedOutcome: "YES"
  },
  {
    id: "human-proof-leverage-2026",
    address: "0xA4E4000000000000000000000000000000000018",
    question: "Will major exchanges require proof-of-human for all leveraged accounts by Dec 2026?",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fingerprint_picture.jpg/1280px-Fingerprint_picture.jpg",
    imageAlt: "Fingerprint macro representing proof-of-human verification",
    category: "Tech",
    status: "active",
    oracleStatus: "pending",
    resolutionTime: "2026-12-20T23:00:00.000Z",
    prices: { yes: 0.37, no: 0.63 },
    leverageCap: 20,
    humanOnly: true,
    feeRate: 0.0004,
    feeDiscountPct: 50,
    stats: { volume24h: 1_620_000, openInterest: 4_420_000, tradedNotional: 31_800_000, fundingRateBps: 3.1 },
    lastTradedOutcome: "YES"
  },
  {
    id: "sol-230-240-dec15-2026",
    address: "0xA4E4000000000000000000000000000000000016",
    question: "Will Solana close between $230 and $240 on Dec 15, 2026?",
    groupQuestion: "Solana price on December 15, 2026?",
    outcomeGroupId: "sol-dec15-2026",
    outcomeBandLabel: "230-240",
    outcomeBandOrder: 1,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Ethereum_%2846501365895%29.jpg/1280px-Ethereum_%2846501365895%29.jpg",
    imageAlt: "Macro close-up of a crypto token on a circuit board",
    category: "Crypto",
    status: "active",
    oracleStatus: "pending",
    resolutionTime: "2026-12-15T23:00:00.000Z",
    prices: { yes: 0.12, no: 0.88 },
    leverageCap: 9,
    stats: { volume24h: 7_100_000, openInterest: 2_900_000, tradedNotional: 23_400_000, fundingRateBps: 1.8 },
    lastTradedOutcome: "YES"
  },
  {
    id: "sol-220-230-dec15-2026",
    address: "0xA4E4000000000000000000000000000000000017",
    question: "Will Solana close between $220 and $230 on Dec 15, 2026?",
    groupQuestion: "Solana price on December 15, 2026?",
    outcomeGroupId: "sol-dec15-2026",
    outcomeBandLabel: "220-230",
    outcomeBandOrder: 2,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Ethereum_%2846501365895%29.jpg/1280px-Ethereum_%2846501365895%29.jpg",
    imageAlt: "Macro close-up of a crypto token on a circuit board",
    category: "Crypto",
    status: "active",
    oracleStatus: "pending",
    resolutionTime: "2026-12-15T23:00:00.000Z",
    prices: { yes: 0.08, no: 0.92 },
    leverageCap: 9,
    stats: { volume24h: 6_900_000, openInterest: 2_500_000, tradedNotional: 20_500_000, fundingRateBps: 1.5 },
    lastTradedOutcome: "NO"
  },
  {
    id: "fed-cut-q4-2026",
    address: "0xA4E4000000000000000000000000000000000012",
    question: "Will the Fed cut rates before Q4 2026?",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/FedBuilding.JPG/1280px-FedBuilding.JPG",
    imageAlt: "Federal Reserve building facade in Washington, D.C.",
    category: "Economy",
    status: "active",
    oracleStatus: "verifying",
    resolutionTime: "2026-09-30T21:00:00.000Z",
    prices: { yes: 0.67, no: 0.33 },
    leverageCap: 8,
    stats: { volume24h: 1_190_000, openInterest: 3_930_000, tradedNotional: 41_000_000, fundingRateBps: -0.6 },
    lastTradedOutcome: "NO"
  },
  {
    id: "eth-etf-inflows",
    address: "0xA4E4000000000000000000000000000000000013",
    question: "Will Ethereum ETF net inflows exceed $30B by Oct 2026?",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/NASDAQ_stock_market_display.jpg/1280px-NASDAQ_stock_market_display.jpg",
    imageAlt: "NASDAQ electronic market display wall with trading data",
    category: "Tech",
    status: "active",
    oracleStatus: "pending",
    resolutionTime: "2026-10-31T21:00:00.000Z",
    prices: { yes: 0.54, no: 0.46 },
    leverageCap: 10,
    stats: { volume24h: 970_000, openInterest: 2_880_000, tradedNotional: 19_300_000, fundingRateBps: 0.9 },
    lastTradedOutcome: "YES"
  },
  {
    id: "senate-majority-2026",
    address: "0xA4E4000000000000000000000000000000000014",
    question: "Will Democrats hold the Senate after the 2026 midterms?",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/US_Capitol_west_side.JPG/1280px-US_Capitol_west_side.JPG",
    imageAlt: "United States Capitol west side under a clear sky",
    category: "Politics",
    status: "paused",
    oracleStatus: "pending",
    resolutionTime: "2026-11-10T12:00:00.000Z",
    prices: { yes: 0.31, no: 0.69 },
    leverageCap: 6,
    stats: { volume24h: 430_000, openInterest: 1_540_000, tradedNotional: 8_500_000, fundingRateBps: -0.2 },
    lastTradedOutcome: "NO"
  },
  {
    id: "fifa-2026-final",
    address: "0xA4E4000000000000000000000000000000000015",
    question: "Will Brazil reach the FIFA 2026 final?",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Crowd_at_Olympiastadion.JPG/1280px-Crowd_at_Olympiastadion.JPG",
    imageAlt: "Packed football stadium crowd during a live match",
    category: "Sports",
    status: "active",
    oracleStatus: "pending",
    resolutionTime: "2026-07-19T20:00:00.000Z",
    prices: { yes: 0.39, no: 0.61 },
    leverageCap: 7,
    stats: { volume24h: 510_000, openInterest: 1_130_000, tradedNotional: 5_000_000, fundingRateBps: 0.4 },
    lastTradedOutcome: "YES"
  }
];

function resolveLiveFundingRate(baseBps: number, seed: number): number {
  const phase = Date.now() / 10_000 + seed * 0.61;
  return Number((baseBps + Math.sin(phase) * 0.9).toFixed(2));
}

function withLiveFundingRate(market: Market, seed: number): Market {
  return {
    ...market,
    stats: {
      ...market.stats,
      fundingRateBps: resolveLiveFundingRate(market.stats.fundingRateBps ?? 0, seed)
    }
  };
}

function withLiveFundingRates(markets: Market[]): Market[] {
  return markets.map((market, index) => withLiveFundingRate(market, index + 1));
}

async function fallbackMarkets(request?: MarketListRequest): Promise<MarketsResponse> {
  await sleep();
  let rows = [...mockMarkets];
  const search = request?.filter?.search?.trim().toLowerCase();

  if (request?.filter?.category && request.filter.category !== "Trending") {
    rows = rows.filter((market) => market.category === request.filter?.category);
  }

  if (request?.filter?.status) {
    rows = rows.filter((market) => market.status === request.filter?.status);
  }

  if (request?.filter?.access === "human-only") {
    rows = rows.filter((market) => Boolean(market.humanOnly));
  }

  if (request?.filter?.access === "standard") {
    rows = rows.filter((market) => !market.humanOnly);
  }

  if (search) {
    rows = rows.filter((market) => market.question.toLowerCase().includes(search));
  }

  return { data: withLiveFundingRates(rows) };
}

export async function fetchMarkets(request?: MarketListRequest): Promise<Market[]> {
  const response = await apiGet<MarketsResponse>(`${env.endpoints.markets}`, () => fallbackMarkets(request));
  return response.data;
}

async function fallbackMarketDetail(marketId: string): Promise<MarketDetailResponse> {
  await sleep();
  const market = mockMarkets.find((item) => item.id === marketId);
  if (!market) {
    throw new Error("Market not found");
  }

  return { data: withLiveFundingRate(market, 1) };
}

export async function fetchMarketById(marketId: string): Promise<Market> {
  const response = await apiGet<MarketDetailResponse>(
    `${env.endpoints.markets}/${marketId}`,
    () => fallbackMarketDetail(marketId)
  );
  return response.data;
}
