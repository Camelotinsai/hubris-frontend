import type { Position } from "@/types/position";

import { SectionCard } from "@/features/shared/components/SectionCard";
import { formatNumber, formatUsd } from "@/lib/format";

interface PositionSummaryProps {
  position: Position | undefined;
}

export function PositionSummary({ position }: PositionSummaryProps) {
  if (!position) {
    return (
      <SectionCard title="Position" subtitle="No active position in this market">
        <p className="text-sm text-muted">Exposure appears after fill confirmation.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Position" subtitle="Current exposure">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-line p-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Outcome</p>
          <p className="mt-1">{position.outcome}</p>
        </div>
        <div className="rounded-xl border border-line p-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Leverage</p>
          <p className="mt-1">{formatNumber(position.leverage, 1)}x</p>
        </div>
        <div className="rounded-xl border border-line p-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Unrealized PnL</p>
          <p className={`mt-1 ${position.unrealizedPnl >= 0 ? "text-positive" : "text-risk"}`}>
            {formatUsd(position.unrealizedPnl)}
          </p>
        </div>
        <div className="rounded-xl border border-line p-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Liq Estimate</p>
          <p className="mt-1 text-risk">{formatNumber(position.liquidationPriceEstimate * 100, 2)}%</p>
        </div>
      </div>
    </SectionCard>
  );
}
