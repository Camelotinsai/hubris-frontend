import type { Market } from "@/types/market";

import { EmptyState } from "@/features/shared/components/EmptyState";
import { MarketCard } from "@/features/markets/components/MarketCard";
import { toMarketCardModels } from "@/features/markets/adapters";

interface MarketGridProps {
  markets: Market[];
  worldIdVerified: boolean;
}

export function MarketGrid({ markets, worldIdVerified }: MarketGridProps) {
  if (markets.length === 0) {
    return (
      <EmptyState
        title="No markets"
        description="No contracts match the current filters."
      />
    );
  }

  const cardModels = toMarketCardModels(markets);

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {cardModels.map((market) => (
        <MarketCard key={market.id} market={market} worldIdVerified={worldIdVerified} />
      ))}
    </div>
  );
}
