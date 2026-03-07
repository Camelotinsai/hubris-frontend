import { useEffect, useMemo, useRef, type ChangeEventHandler } from "react";
import { useAtom } from "jotai";
import { useSearchParams } from "react-router-dom";
import { RotateCcw, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorldId } from "@/hooks/use-world-id";
import { ErrorState } from "@/features/shared/components/ErrorState";
import { LoadingState } from "@/features/shared/components/LoadingState";
import { PageHeader } from "@/features/shared/components/PageHeader";
import { SectionCard } from "@/features/shared/components/SectionCard";
import { portfolioTabAtom } from "@/state/atoms/portfolio";
import { usePortfolioQueries } from "@/features/portfolio/queries";
import { PortfolioSummary } from "@/features/portfolio/components/PortfolioSummary";
import { VaultBalanceCard } from "@/features/portfolio/components/VaultBalanceCard";
import { UnrealizedPnlCard } from "@/features/portfolio/components/UnrealizedPnlCard";
import { PositionsTable } from "@/features/portfolio/components/PositionsTable";
import { OpenOrdersTable } from "@/features/portfolio/components/OpenOrdersTable";
import { OrderHistoryTable } from "@/features/portfolio/components/OrderHistoryTable";
import { ShareBalancesTable } from "@/features/portfolio/components/ShareBalancesTable";
import { ProfileAvatar, SHARED_PROFILE_AVATAR_SEED } from "@/features/shared/components/ProfileAvatar";
import { profileAvatarDataUrlAtom } from "@/state/atoms/profile";
import { useWallet } from "@/hooks/use-wallet";

const portfolioTabs = ["positions", "orders", "history", "shares"] as const;

function isPortfolioTab(value: string | null): value is (typeof portfolioTabs)[number] {
  return value !== null && portfolioTabs.includes(value as (typeof portfolioTabs)[number]);
}

export function PortfolioPage() {
  const wallet = useWallet();
  const [activeTab, setActiveTab] = useAtom(portfolioTabAtom);
  const [profileAvatarDataUrl, setProfileAvatarDataUrl] = useAtom(profileAvatarDataUrlAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  const queries = usePortfolioQueries();
  const worldId = useWorldId();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const humanOnlyByMarketId = useMemo(
    () => new Map((queries.marketsQuery.data ?? []).map((market) => [market.id, Boolean(market.humanOnly)])),
    [queries.marketsQuery.data]
  );
  const humanOnlyPositions = (queries.positionsQuery.data ?? []).filter((position) =>
    Boolean(humanOnlyByMarketId.get(position.marketId))
  ).length;
  const humanOnlyOpenOrders = (queries.openOrdersQuery.data ?? []).filter((order) =>
    Boolean(humanOnlyByMarketId.get(order.marketId))
  ).length;
  const humanOnlyShares = (queries.shareBalancesQuery.data ?? []).filter((balance) =>
    Boolean(humanOnlyByMarketId.get(balance.marketId))
  ).length;

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (isPortfolioTab(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [activeTab, searchParams, setActiveTab]);

  if (!wallet.isConnected) {
    return (
      <section className="space-y-6">
        <PageHeader title="Portfolio" description="Exposure, margin, and settlement status in one operational view." />
      </section>
    );
  }

  const openUploadPicker = () => {
    uploadInputRef.current?.click();
  };

  const onAvatarFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileAvatarDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.currentTarget.value = "";
  };

  if (queries.summaryQuery.isLoading) {
    return <LoadingState lines={8} />;
  }

  if (queries.summaryQuery.isError || !queries.summaryQuery.data) {
    return <ErrorState description="Portfolio could not be loaded." onRetry={() => queries.summaryQuery.refetch()} />;
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Portfolio" description="Exposure, margin, and settlement status in one operational view." />

      <SectionCard title="Profile Avatar" subtitle="Upload and manage your profile image">
        <div className="flex flex-wrap items-center gap-3">
          <ProfileAvatar className="h-12 w-12" seed={SHARED_PROFILE_AVATAR_SEED} showStatus={false} />
          <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFileChange} />
          <Button type="button" variant="secondary" size="sm" className="w-fit" onClick={openUploadPicker}>
            <Upload className="h-3.5 w-3.5" />
            Upload Avatar
          </Button>
          {profileAvatarDataUrl ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-fit"
              onClick={() => setProfileAvatarDataUrl(null)}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Avatar
            </Button>
          ) : null}
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-3">
        <PortfolioSummary summary={queries.summaryQuery.data} />
        <VaultBalanceCard summary={queries.summaryQuery.data} />
        <UnrealizedPnlCard summary={queries.summaryQuery.data} />
      </div>

      <SectionCard title="World ID Access" subtitle="Human-only market exposure">
        <div className="space-y-4">
          {worldId.isVerified ? <Badge variant="positive">World ID Verified</Badge> : null}
          <p className="text-xs text-muted">
            {worldId.isVerified
              ? "World ID verified for this wallet. Human-only market operations are enabled."
              : "Verify World ID to submit orders on human-only markets and keep discounted fee access active."}
          </p>
          {!worldId.isVerified ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-fit"
              disabled={!worldId.walletConnected || worldId.isPending}
              onClick={worldId.verify}
            >
              {worldId.isPending ? "Verifying World ID" : "Verify with World ID"}
            </Button>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line p-4 text-xs">
              <p className="uppercase tracking-[0.14em] text-muted">Positions</p>
              <p className="kpi-number mt-1">{humanOnlyPositions}</p>
            </div>
            <div className="rounded-xl border border-line p-4 text-xs">
              <p className="uppercase tracking-[0.14em] text-muted">Open Orders</p>
              <p className="kpi-number mt-1">{humanOnlyOpenOrders}</p>
            </div>
            <div className="rounded-xl border border-line p-4 text-xs">
              <p className="uppercase tracking-[0.14em] text-muted">Share Balances</p>
              <p className="kpi-number mt-1">{humanOnlyShares}</p>
            </div>
          </div>
        </div>
      </SectionCard>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          const typed = value as typeof activeTab;
          setActiveTab(typed);
          const next = new URLSearchParams(searchParams);
          next.set("tab", typed);
          setSearchParams(next, { replace: true });
          track("portfolio_tab_switch", { tab: typed });
        }}
      >
        <TabsList>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="orders">Open Orders</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
          <TabsTrigger value="shares">Share Balances</TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          <SectionCard title="Positions" subtitle="Live exposure and liquidation thresholds">
            <PositionsTable rows={queries.positionsQuery.data ?? []} humanOnlyByMarketId={humanOnlyByMarketId} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="orders">
          <SectionCard title="Open Orders" subtitle="Outstanding instructions">
            <OpenOrdersTable rows={queries.openOrdersQuery.data ?? []} humanOnlyByMarketId={humanOnlyByMarketId} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="history">
          <SectionCard title="Order History" subtitle="Execution record">
            <OrderHistoryTable rows={queries.orderHistoryQuery.data ?? []} humanOnlyByMarketId={humanOnlyByMarketId} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="shares">
          <SectionCard title="Share Balances" subtitle="Claimable outcome inventory">
            <ShareBalancesTable rows={queries.shareBalancesQuery.data ?? []} humanOnlyByMarketId={humanOnlyByMarketId} />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </section>
  );
}
