import type { PortfolioSummary } from "@/types/portfolio";

import { SectionCard } from "@/features/shared/components/SectionCard";
import { formatUsd } from "@/lib/format";

interface UnrealizedPnlCardProps {
  summary: PortfolioSummary;
}

export function UnrealizedPnlCard({ summary }: UnrealizedPnlCardProps) {
  const positive = summary.unrealizedPnl >= 0;

  return (
    <SectionCard title="Unrealized PnL" subtitle="Mark-to-market exposure">
      <p className={`kpi-number text-2xl font-semibold ${positive ? "text-positive" : "text-risk"}`}>
        {formatUsd(summary.unrealizedPnl)}
      </p>
    </SectionCard>
  );
}
