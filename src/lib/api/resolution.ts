import { apiGet, sleep } from "@/lib/api/client";
import type { ResolutionResponse } from "@/lib/api/types";
import { env } from "@/lib/env";
import { mockMarkets } from "@/lib/api/markets";
import type { ResolutionState } from "@/types/resolution";

const mockResolutionByMarket: Record<string, ResolutionState> = {
  "btc-150k-2026": {
    marketId: "btc-150k-2026",
    marketStatus: "active",
    oracleStatus: "pending",
    settlementStatus: "open",
    timeline: [
      {
        id: "r1",
        marketId: "btc-150k-2026",
        title: "Market Initialized",
        status: "completed",
        timestamp: "2025-12-31T00:00:00.000Z",
        details: "Collateral and market parameters locked on-chain."
      },
      {
        id: "r2",
        marketId: "btc-150k-2026",
        title: "Oracle Observation Window",
        status: "current",
        details: "Oracle source accepted. Final observation at expiry timestamp."
      },
      {
        id: "r3",
        marketId: "btc-150k-2026",
        title: "Settlement",
        status: "pending",
        details: "Vault settlement callable after final verification period."
      }
    ]
  }
};

async function fallbackResolution(marketId: string): Promise<ResolutionResponse> {
  await sleep(150);
  const market = mockMarkets.find((item) => item.id === marketId);

  return {
    data:
      mockResolutionByMarket[marketId] ?? {
        marketId,
        marketStatus: market?.status ?? "active",
        oracleStatus: market?.oracleStatus ?? "pending",
        settlementStatus: "open",
        timeline: []
      }
  };
}

export async function fetchResolutionState(marketId: string): Promise<ResolutionState> {
  const response = await apiGet<ResolutionResponse>(
    `${env.endpoints.markets}/${marketId}/resolution`,
    () => fallbackResolution(marketId)
  );
  return response.data;
}
