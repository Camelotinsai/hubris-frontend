import type { MarketFilter } from "@/types/market";

import { useMarketList } from "@/hooks/use-market-list";

export function useMarketsQuery(filter: MarketFilter) {
  return useMarketList(filter);
}
