import { useQuery } from "@tanstack/react-query";

import { fetchMarkets } from "@/lib/api/markets";
import type { MarketFilter } from "@/types/market";

export function useMarketList(filter: MarketFilter) {
  return useQuery({
    queryKey: ["markets", filter],
    queryFn: () => fetchMarkets({ filter }),
    refetchInterval: 10_000
  });
}
