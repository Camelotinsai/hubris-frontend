import { useState } from "react";
import type { Market } from "@/types/market";

import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/features/shared/components/StatusPill";
import { formatDateTime } from "@/lib/dates";
import { formatSignedBps } from "@/lib/format";
import { resolveMarketImageSrc, getMarketImageFallback } from "@/features/markets/image-fallback";

interface MarketHeaderProps {
  market: Market;
}

export function MarketHeader({ market }: MarketHeaderProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = resolveMarketImageSrc(market.imageUrl, market.category, imageFailed);
  const fallbackSrc = getMarketImageFallback(market.category);
  const isFallback = imageSrc === fallbackSrc;

  // For grouped outcome markets show "OutcomeLabel — GroupQuestion"
  const displayQuestion = market.groupQuestion
    ? `${market.outcomeBandLabel ?? ""} — ${market.groupQuestion}`.trim()
    : market.question;

  return (
    <header className="overflow-hidden rounded-2xl border border-line bg-panel shadow-threshold">
      {/* Cover image */}
      <div className="relative h-32 w-full overflow-hidden bg-panel2">
        <img
          src={imageSrc}
          alt={market.imageAlt ?? `${market.category} market visual`}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => {
            if (!imageFailed && market.imageUrl) { setImageFailed(true); return; }
          }}
        />
        {isFallback ? (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-positive/10" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/20 to-transparent" />
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{market.category}</Badge>
            {market.humanOnly ? <Badge variant="neutral">Human Only</Badge> : null}
            {market.feeDiscountPct ? <Badge variant="positive">Fee -{market.feeDiscountPct}%</Badge> : null}
          </div>
          <StatusPill status={market.status} />
        </div>

        {market.groupQuestion ? (
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{market.groupQuestion}</p>
            <h1 className="text-lg font-semibold leading-tight">{market.outcomeBandLabel ?? market.question}</h1>
          </div>
        ) : (
          <h1 className="text-lg leading-tight">{displayQuestion}</h1>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs text-muted sm:grid-cols-5">
          <p className="kpi-number">YES {Math.round(market.prices.yes * 100)}%</p>
          <p className="kpi-number text-risk">NO {Math.round(market.prices.no * 100)}%</p>
          <p className="kpi-number">Cap {market.leverageCap}x</p>
          <p>Funding {formatSignedBps(market.stats.fundingRateBps ?? 0)}</p>
          <p>Resolves {formatDateTime(market.resolutionTime)}</p>
        </div>
      </div>
    </header>
  );
}
