import { useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/dates";
import { formatNumber } from "@/lib/format";
import { useMarketWs } from "@/hooks/use-market-ws";
import { ErrorState } from "@/features/shared/components/ErrorState";
import { LoadingState } from "@/features/shared/components/LoadingState";
import { SectionCard } from "@/features/shared/components/SectionCard";
import { MarketHeader } from "@/features/trade/components/MarketHeader";
import { TradeTicket } from "@/features/trade/components/TradeTicket";
import { OrderbookPanel } from "@/features/trade/components/OrderbookPanel";
import { RecentTrades } from "@/features/trade/components/RecentTrades";
import { PositionSummary } from "@/features/trade/components/PositionSummary";
import { useTradePageQueries } from "@/features/trade/queries";
import { ResolutionStatusCard } from "@/features/resolution/components/ResolutionStatusCard";
import { VerificationTimeline } from "@/features/resolution/components/VerificationTimeline";
import { SettlementStatus } from "@/features/resolution/components/SettlementStatus";
import type { OutcomeSide } from "@/types/enums";

export function TradePage() {
  const params = useParams<{ marketId: string }>();
  const [searchParams] = useSearchParams();
  const marketId = params.marketId ?? "";
  const rawOutcome = searchParams.get("outcome");
  const initialOutcome: OutcomeSide | undefined = rawOutcome === "YES" || rawOutcome === "NO" ? rawOutcome : undefined;
  const queryClient = useQueryClient();

  const {
    marketQuery,
    orderbookQuery,
    tradesQuery,
    openOrdersQuery,
    positionsQuery,
    resolutionQuery
  } = useTradePageQueries(marketId);

  const onWsPulse = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["orderbook", marketId] });
    queryClient.invalidateQueries({ queryKey: ["recent-trades", marketId] });
  }, [marketId, queryClient]);

  useMarketWs(marketId, onWsPulse, Boolean(marketQuery.data));

  if (marketQuery.isLoading) {
    return <LoadingState lines={8} />;
  }

  if (marketQuery.isError || !marketQuery.data) {
    return (
      <ErrorState
        description="Trade surface unavailable. Market state could not be loaded."
        onRetry={() => marketQuery.refetch()}
      />
    );
  }

  const market = marketQuery.data;
  const position = positionsQuery.data?.find((item) => item.marketId === market.id);
  const openOrders = openOrdersQuery.data?.filter((order) => order.marketId === market.id) ?? [];

  return (
    <section className="space-y-4">
      <MarketHeader market={market} />

      <div className="grid gap-4 xl:grid-cols-[420px_1fr]">
        <TradeTicket market={market} initialOutcome={initialOutcome} />

        <div className="space-y-4">
          {orderbookQuery.data ? <OrderbookPanel orderbook={orderbookQuery.data} /> : <LoadingState lines={5} />}
          {tradesQuery.data ? <RecentTrades trades={tradesQuery.data} /> : <LoadingState lines={4} />}
          <PositionSummary position={position} />
        </div>
      </div>

      <SectionCard title="Open Orders" subtitle="Outstanding orders for this market">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {openOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted">
                  No open orders for this market
                </TableCell>
              </TableRow>
            ) : (
              openOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.side}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.price ? `${formatNumber(order.price * 100, 2)}%` : "MKT"}</TableCell>
                  <TableCell>{formatNumber(order.size, 0)}</TableCell>
                  <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </SectionCard>

      {resolutionQuery.data ? (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <ResolutionStatusCard state={resolutionQuery.data} />
          <SectionCard
            title="Verification Timeline"
            subtitle="Oracle-backed transition path"
            action={<SettlementStatus status={resolutionQuery.data.settlementStatus} />}
          >
            <VerificationTimeline events={resolutionQuery.data.timeline} />
          </SectionCard>
        </div>
      ) : null}
    </section>
  );
}
