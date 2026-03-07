import { useQuery } from "@tanstack/react-query";

import { fetchMarketById } from "@/lib/api/markets";

export function useMarket(marketId: string) {
  return useQuery({
    queryKey: ["market", marketId],
    queryFn: () => fetchMarketById(marketId),
    enabled: Boolean(marketId),
    retry: false,
    refetchInterval: 10_000
  });
}
