import { useMarket } from "@/hooks/use-market";
import { useOpenOrders } from "@/hooks/use-open-orders";
import { useOrderbook } from "@/hooks/use-orderbook";
import { usePositions } from "@/hooks/use-positions";
import { useResolutionTimeline } from "@/hooks/use-resolution-timeline";

export function useTradePageQueries(marketId: string) {
  const marketQuery = useMarket(marketId);
  const { orderbookQuery, tradesQuery } = useOrderbook(marketId);
  const openOrdersQuery = useOpenOrders();
  const positionsQuery = usePositions();
  const resolutionQuery = useResolutionTimeline(marketId);

  return {
    marketQuery,
    orderbookQuery,
    tradesQuery,
    openOrdersQuery,
    positionsQuery,
    resolutionQuery
  };
}
