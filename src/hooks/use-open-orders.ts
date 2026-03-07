import { useQuery } from "@tanstack/react-query";

import { fetchOpenOrders } from "@/lib/api/orderbook";

export function useOpenOrders() {
  return useQuery({
    queryKey: ["open-orders"],
    queryFn: fetchOpenOrders,
    refetchInterval: 10_000
  });
}
