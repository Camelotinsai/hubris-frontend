import type { PortfolioSummary } from "@/types/portfolio";

import { SectionCard } from "@/features/shared/components/SectionCard";
import { formatUsd } from "@/lib/format";

interface VaultBalanceCardProps {
  summary: PortfolioSummary;
}

export function VaultBalanceCard({ summary }: VaultBalanceCardProps) {
  return (
    <SectionCard title="Vault Balance" subtitle="USDC collateral available">
      <p className="kpi-number text-2xl font-semibold">{formatUsd(summary.vaultBalance)}</p>
    </SectionCard>
  );
}
