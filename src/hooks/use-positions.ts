import { useQuery } from "@tanstack/react-query";

import { fetchPositions } from "@/lib/api/positions";

export function usePositions() {
  return useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
    refetchInterval: 12_000
  });
}
