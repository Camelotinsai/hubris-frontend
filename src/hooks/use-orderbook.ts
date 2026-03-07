import { useQueries } from "@tanstack/react-query";

import { fetchOrderbook, fetchRecentTrades } from "@/lib/api/orderbook";

export function useOrderbook(marketId: string) {
  const [orderbookQuery, tradesQuery] = useQueries({
    queries: [
      {
        queryKey: ["orderbook", marketId],
        queryFn: () => fetchOrderbook(marketId),
        enabled: Boolean(marketId),
        refetchInterval: 8_000
      },
      {
        queryKey: ["recent-trades", marketId],
        queryFn: () => fetchRecentTrades(marketId),
        enabled: Boolean(marketId),
        refetchInterval: 8_000
      }
    ]
  });

  return {
    orderbookQuery,
    tradesQuery
  };
}
