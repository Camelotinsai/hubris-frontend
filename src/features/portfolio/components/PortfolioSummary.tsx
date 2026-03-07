import type { PortfolioSummary as PortfolioSummaryType } from "@/types/portfolio";

import { SectionCard } from "@/features/shared/components/SectionCard";
import { formatPct, formatUsd } from "@/lib/format";

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
}

export function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  return (
    <SectionCard title="Portfolio Value" subtitle="Total account exposure">
      <div className="space-y-1">
        <p className="kpi-number text-2xl font-semibold">{formatUsd(summary.portfolioValue)}</p>
        <p className="text-xs text-muted">Margin ratio {formatPct(summary.marginRatio)}</p>
      </div>
    </SectionCard>
  );
}
