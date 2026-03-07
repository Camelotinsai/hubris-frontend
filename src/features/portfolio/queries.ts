import { useOpenOrders } from "@/hooks/use-open-orders";
import { usePortfolio } from "@/hooks/use-portfolio";
import { usePositions } from "@/hooks/use-positions";
import { useMarketList } from "@/hooks/use-market-list";
import { useQuery } from "@tanstack/react-query";

import { fetchOrderHistory, fetchShareBalances } from "@/lib/api/positions";

export function usePortfolioQueries() {
  const summaryQuery = usePortfolio();
  const positionsQuery = usePositions();
  const openOrdersQuery = useOpenOrders();
  const marketsQuery = useMarketList({});
  const orderHistoryQuery = useQuery({
    queryKey: ["order-history"],
    queryFn: fetchOrderHistory
  });
  const shareBalancesQuery = useQuery({
    queryKey: ["share-balances"],
    queryFn: fetchShareBalances
  });

  return {
    summaryQuery,
    positionsQuery,
    openOrdersQuery,
    marketsQuery,
    orderHistoryQuery,
    shareBalancesQuery
  };
}
