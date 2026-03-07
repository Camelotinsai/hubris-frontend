import { useQuery } from "@tanstack/react-query";

import { fetchPortfolioSummary } from "@/lib/api/portfolio";

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio-summary"],
    queryFn: fetchPortfolioSummary,
    refetchInterval: 10_000
  });
}
