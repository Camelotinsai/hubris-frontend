import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { fetchPositions } from "@/lib/api/positions";

export function usePositions() {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["positions", address],
    queryFn: () => fetchPositions(address),
    enabled: true,
    refetchInterval: 12_000
  });
}
