import { useMemo } from "react";
import { useAtom } from "jotai";

import type { Market } from "@/types/market";

import { tradeTicketAtom } from "@/state/atoms/trade";
import { getEntryPrice } from "@/features/trade/adapters";
import {
  calculateMarketPayment,
  calculateFeeEstimate,
  calculateLiquidationPriceEstimate,
  calculateNotional,
  calculatePriceImpact,
  calculateProjectedPnl,
  resolveFeeRate
} from "@/features/trade/math";
import { validateTradeTicket } from "@/features/trade/validation";

interface UseTradeTicketOptions {
  worldIdVerified?: boolean;
}

export function useTradeTicket(market: Market | undefined, options?: UseTradeTicketOptions) {
  const [ticket, setTicket] = useAtom(tradeTicketAtom);

  const entryPrice = getEntryPrice(ticket, market);
  const notional = calculateNotional(ticket.collateral, ticket.leverage);
  const feeRate = resolveFeeRate(market?.feeRate);
  const feeEstimate = calculateFeeEstimate(notional, feeRate);
  const marketPayment = calculateMarketPayment(ticket.collateral, feeEstimate);
  const feeDiscountPct = market?.feeDiscountPct ?? 0;
  const liquidationPriceEstimate = calculateLiquidationPriceEstimate({
    collateral: ticket.collateral,
    leverage: ticket.leverage,
    entryPrice,
    side: ticket.side,
    outcome: ticket.outcome
  });
  const priceImpactEstimate = calculatePriceImpact(ticket.quantity);

  const validation = validateTradeTicket(ticket, market, { worldIdVerified: options?.worldIdVerified });

  const projectedPnl = useMemo(() => {
    if (!market) return 0;
    const mark = ticket.outcome === "YES" ? market.prices.yes : market.prices.no;
    return calculateProjectedPnl(entryPrice, mark, ticket.quantity, ticket.side);
  }, [market, ticket, entryPrice]);

  const riskLevel: "normal" | "high" =
    ticket.leverage >= (market?.leverageCap ?? 10) * 0.75 ? "high" : "normal";

  return {
    ticket,
    setTicket,
    entryPrice,
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
  };
}
