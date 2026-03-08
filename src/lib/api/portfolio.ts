import { apiGet, sleep } from "@/lib/api/client";
import type { PortfolioResponse } from "@/lib/api/types";
import { env } from "@/lib/env";
import type { PortfolioSummary } from "@/types/portfolio";
import { readPortfolioSummary } from "@/lib/web3/read-contracts";

const mockPortfolioSummary: PortfolioSummary = {
  account: "0x7fA313B7A8D0c2B332bA08992EAfECfA32434567",
  vaultBalance: 63_220.15,
  portfolioValue: 87_348.42,
  unrealizedPnl: 4_128.55,
  realizedPnl: 8_014.31,
  usedMargin: 21_410,
  availableMargin: 41_810.15,
  marginRatio: 0.256
};

async function fallbackPortfolio(): Promise<PortfolioResponse> {
  await sleep(140);
  return { data: mockPortfolioSummary };
}

export async function fetchPortfolioSummary(userAddress?: string): Promise<PortfolioSummary> {
  if (!env.mockData && userAddress) {
    try {
      return await readPortfolioSummary(userAddress as `0x${string}`);
    } catch {
      // fall through to API / mock
    }
  }
  const response = await apiGet<PortfolioResponse>(`${env.endpoints.portfolio}/summary`, fallbackPortfolio);
  return response.data;
}
