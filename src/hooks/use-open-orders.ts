import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { fetchOpenOrders } from "@/lib/api/orderbook";

export function useOpenOrders() {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["open-orders", address],
    queryFn: () => fetchOpenOrders(address),
    refetchInterval: 10_000
  });
}
