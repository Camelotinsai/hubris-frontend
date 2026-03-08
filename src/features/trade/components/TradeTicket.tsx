import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import type { Market } from "@/types/market";
import type { OutcomeSide } from "@/types/enums";

import { Input } from "@/components/ui/input";
import { track } from "@/lib/analytics";
import { formatNumber, formatUsd } from "@/lib/format";
import { useTradeTicket } from "@/hooks/use-trade-ticket";
import { useWorldId } from "@/hooks/use-world-id";
import { useNotifications } from "@/hooks/use-notifications";
import { useSubmitTradeMutation } from "@/features/trade/mutations";
import { OutcomeToggle } from "@/features/trade/components/OutcomeToggle";
import { OrderTypeTabs } from "@/features/trade/components/OrderTypeTabs";
import { LeverageSlider } from "@/features/trade/components/LeverageSlider";
import { CollateralInput } from "@/features/trade/components/CollateralInput";
import { PriceInput } from "@/features/trade/components/PriceInput";
import { LiquidationPriceCard } from "@/features/trade/components/LiquidationPriceCard";
import { RiskBanner } from "@/features/trade/components/RiskBanner";
import { SubmitOrderButton } from "@/features/trade/components/SubmitOrderButton";
import { resolveMarketImageSrc } from "@/features/markets/image-fallback";

interface TradeTicketProps {
  market: Market;
  initialOutcome?: OutcomeSide;
}

export function TradeTicket({ market, initialOutcome }: TradeTicketProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [fallbackImageFailed, setFallbackImageFailed] = useState(false);
  const worldId = useWorldId();
  const { notifyError, notifySuccess } = useNotifications();
  const {
    ticket,
    setTicket,
    setCollateral,
    setQuantity,
    setLeverage,
    notional,
    marketPayment,
    feeEstimate,
    feeRate,
    feeDiscountPct,
    liquidationPriceEstimate,
    priceImpactEstimate,
    projectedPnl,
    validation,
    riskLevel
  } = useTradeTicket(market, { worldIdVerified: worldId.isVerified });

  const mutation = useSubmitTradeMutation();

  const canSubmit = validation.isValid && !mutation.isPending;
  const imageSrc = resolveMarketImageSrc(market.imageUrl, market.category, imageFailed);

  const validationText = useMemo(() => validation.errors.join(" "), [validation]);

  useEffect(() => {
    if (!initialOutcome) return;
    setTicket((prev) => (prev.outcome === initialOutcome ? prev : { ...prev, outcome: initialOutcome }));
  }, [initialOutcome, market.id, setTicket]);

  useEffect(() => {
    setImageFailed(false);
    setFallbackImageFailed(false);
  }, [market.id, market.imageUrl, market.category]);

  return (
    <section className="space-y-5 rounded-2xl border border-line bg-panel p-5 shadow-threshold">
      <div className="space-y-3">
        <h2 className="text-sm">Trade Ticket</h2>
        <p className="text-xs text-muted">Above the ceiling, only math survives.</p>
      </div>

      <div className="relative h-20 overflow-hidden rounded-xl border border-line-strong">
        {!fallbackImageFailed ? (
          <img
            src={imageSrc}
            alt={market.imageAlt ?? `${market.category} market visual`}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => {
              if (!imageFailed && market.imageUrl) {
                setImageFailed(true);
                return;
              }

              setFallbackImageFailed(true);
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-panel2 via-bg to-panel2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-bg/55 via-bg/35 to-bg/70" />
      </div>

      {market.humanOnly ? (
        <div className="space-y-2 rounded-xl border border-line bg-panel2/70 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Human-only market access</p>
          <p className="text-xs text-muted">
            {worldId.isVerified
              ? "World ID verified. Human-only orders are enabled for this wallet."
              : "World ID verification is required before submitting orders in this market."}
          </p>
          {!worldId.isVerified ? (
            <p className="text-xs text-muted">
              Go to{" "}
              <Link to="/portfolio" className="underline decoration-line-strong underline-offset-4 text-text">
                Portfolio
              </Link>{" "}
              to complete verification.
            </p>
          ) : null}
        </div>
      ) : null}

      <OutcomeToggle value={ticket.outcome} onChange={(outcome) => setTicket((prev) => ({ ...prev, outcome }))} />

      <OrderTypeTabs
        value={ticket.type}
        onChange={(type) => setTicket((prev) => ({ ...prev, type }))}
      />

      <CollateralInput
        value={ticket.collateral}
        onChange={setCollateral}
      />

      <label className="space-y-2 text-xs uppercase tracking-[0.14em] text-muted">
        Size / Notional Units
        <Input
          type="number"
          min={0}
          value={Number.isNaN(ticket.quantity) ? "" : ticket.quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
      </label>

      <LeverageSlider
        value={ticket.leverage}
        max={market.leverageCap}
        onChange={setLeverage}
      />

      <PriceInput
        value={ticket.limitPrice}
        onChange={(limitPrice) => setTicket((prev) => ({ ...prev, limitPrice }))}
        disabled={ticket.type === "MARKET"}
      />

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl border border-line p-3">
          <p className="uppercase tracking-[0.14em] text-muted">Market Payment</p>
          <p className="kpi-number mt-1">{formatUsd(marketPayment)}</p>
          <p className="mt-1 text-[11px] text-muted">Collateral + fees</p>
        </div>
        <div className="rounded-xl border border-line p-3">
          <p className="uppercase tracking-[0.14em] text-muted">Exposure</p>
          <p className="kpi-number mt-1">{formatUsd(notional)}</p>
        </div>
        <div className="rounded-xl border border-line p-3">
          <p className="uppercase tracking-[0.14em] text-muted">Fees</p>
          <p className="kpi-number mt-1">{formatUsd(feeEstimate)}</p>
          <p className="mt-1 text-[11px] text-muted">
            {formatNumber(feeRate * 10_000, 1)} bps
            {feeDiscountPct > 0 ? ` (-${formatNumber(feeDiscountPct, 0)}%)` : ""}
          </p>
        </div>
        <div className="rounded-xl border border-line p-3">
          <p className="uppercase tracking-[0.14em] text-muted">Impact</p>
          <p className="kpi-number mt-1">{formatNumber(priceImpactEstimate, 2)}%</p>
        </div>
        <div className="rounded-xl border border-line p-3">
          <p className="uppercase tracking-[0.14em] text-muted">Projected PnL</p>
          <p className={`kpi-number mt-1 ${projectedPnl >= 0 ? "text-positive" : "text-risk"}`}>{formatUsd(projectedPnl)}</p>
        </div>
      </div>

      <LiquidationPriceCard value={liquidationPriceEstimate} />

      <RiskBanner riskLevel={riskLevel} leverage={ticket.leverage} />

      {!validation.isValid ? <p className="text-xs text-risk">{validationText}</p> : null}

      <SubmitOrderButton
        disabled={!canSubmit}
        pending={mutation.isPending}
        onClick={() => {
          const isMarketOrder = ticket.type === "MARKET";
          track("trade_ticket_submit", {
            marketId: market.id,
            type: ticket.type,
            side: ticket.side,
            outcome: ticket.outcome,
            leverage: ticket.leverage,
            feeEstimate,
            marketPayment,
            worldIdVerified: worldId.isVerified
          });
          mutation.mutate(
            { marketAddress: market.address, ticket },
            {
              onSuccess: (result) => {
                notifySuccess({
                  title: isMarketOrder ? "Market order submitted" : "Limit order submitted",
                  message: `Tx ${result.txHash.slice(0, 8)}...${result.txHash.slice(-6)}`
                });
              },
              onError: (error) => {
                notifyError({
                  title: isMarketOrder ? "Market order failed" : "Order submission failed",
                  message: error instanceof Error ? error.message : "Retry after state sync."
                });
              }
            }
          );
        }}
      />

      <div aria-live="polite" className="min-h-4">
        {mutation.data ? <p className="text-xs text-positive">Submitted: {mutation.data.txHash}</p> : null}
        {mutation.isError ? <p className="text-xs text-risk">Submission failed. Retry after state sync.</p> : null}
      </div>
    </section>
  );
}
