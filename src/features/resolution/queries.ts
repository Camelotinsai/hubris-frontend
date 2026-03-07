import { useResolutionTimeline } from "@/hooks/use-resolution-timeline";

export function useResolutionQuery(marketId: string) {
  return useResolutionTimeline(marketId);
}
