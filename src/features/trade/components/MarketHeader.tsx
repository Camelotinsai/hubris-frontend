import type { Market } from "@/types/market";

import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/features/shared/components/StatusPill";
import { formatDateTime } from "@/lib/dates";
import { formatSignedBps } from "@/lib/format";

interface MarketHeaderProps {
  market: Market;
}

export function MarketHeader({ market }: MarketHeaderProps) {
  return (
    <header className="space-y-4 rounded-2xl border border-line bg-panel p-5 shadow-threshold">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{market.category}</Badge>
          {market.humanOnly ? <Badge variant="neutral">Human Only</Badge> : null}
          {market.feeDiscountPct ? <Badge variant="positive">Fee -{market.feeDiscountPct}%</Badge> : null}
        </div>
        <StatusPill status={market.status} />
      </div>
      <h1 className="text-lg leading-tight">{market.question}</h1>
      <div className="grid grid-cols-2 gap-4 text-xs text-muted sm:grid-cols-5">
        <p className="kpi-number">YES {Math.round(market.prices.yes * 100)}%</p>
        <p className="kpi-number text-risk">NO {Math.round(market.prices.no * 100)}%</p>
        <p className="kpi-number">Cap {market.leverageCap}x</p>
        <p>Funding {formatSignedBps(market.stats.fundingRateBps ?? 0)}</p>
        <p>Resolves {formatDateTime(market.resolutionTime)}</p>
      </div>
    </header>
  );
}
