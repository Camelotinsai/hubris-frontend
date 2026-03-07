import type { PortfolioSummary } from "@/types/portfolio";

export function portfolioHealth(summary: PortfolioSummary): "healthy" | "warning" {
  return summary.marginRatio > 0.2 ? "healthy" : "warning";
}
