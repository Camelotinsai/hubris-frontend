import { useQuery } from "@tanstack/react-query";

import { fetchResolutionState } from "@/lib/api/resolution";

export function useResolutionTimeline(marketId: string) {
  return useQuery({
    queryKey: ["resolution", marketId],
    queryFn: () => fetchResolutionState(marketId),
    enabled: Boolean(marketId),
    refetchInterval: 30_000
  });
}
