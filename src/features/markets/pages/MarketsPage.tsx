import { useMemo } from "react";
import { useAtomValue } from "jotai";

import { ErrorState } from "@/features/shared/components/ErrorState";
import { LoadingState } from "@/features/shared/components/LoadingState";
import { PageHeader } from "@/features/shared/components/PageHeader";
import { MarketFilters } from "@/features/markets/components/MarketFilters";
import { MarketGrid } from "@/features/markets/components/MarketGrid";
import { MarketSearch } from "@/features/markets/components/MarketSearch";
import { CategoryTabs } from "@/features/markets/components/CategoryTabs";
import { useMarketsQuery } from "@/features/markets/queries";
import { useWorldId } from "@/hooks/use-world-id";
import { marketSearchAtom, marketsAccessFilterAtom, marketsStatusFilterAtom, selectedCategoryAtom } from "@/state/atoms/ui";
import type { MarketFilter } from "@/types/market";

export function MarketsPage() {
  const category = useAtomValue(selectedCategoryAtom);
  const search = useAtomValue(marketSearchAtom);
  const status = useAtomValue(marketsStatusFilterAtom);
  const access = useAtomValue(marketsAccessFilterAtom);
  const worldId = useWorldId();

  const filter = useMemo<MarketFilter>(() => {
    const next: MarketFilter = {
      category,
      search
    };

    if (status !== "all") {
      next.status = status;
    }

    if (access !== "all") {
      next.access = access;
    }

    return next;
  }, [access, category, search, status]);

  const marketsQuery = useMarketsQuery(filter);

  return (
    <section className="space-y-6">
      <PageHeader
        title="Markets"
        description="Scan probability surfaces. Apply size where your view breaks consensus."
      />

      <CategoryTabs />

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <MarketSearch />
        <MarketFilters />
      </div>

      {marketsQuery.isLoading ? <LoadingState lines={6} /> : null}
      {marketsQuery.isError ? (
        <ErrorState
          description="Unable to load market state. Verify API and websocket surfaces."
          onRetry={() => marketsQuery.refetch()}
        />
      ) : null}
      {marketsQuery.data ? <MarketGrid markets={marketsQuery.data} worldIdVerified={worldId.isVerified} /> : null}
    </section>
  );
}
