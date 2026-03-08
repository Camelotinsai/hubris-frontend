import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { fetchPortfolioSummary } from "@/lib/api/portfolio";

export function usePortfolio() {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["portfolio-summary", address],
    queryFn: () => fetchPortfolioSummary(address),
    refetchInterval: 10_000
  });
}
