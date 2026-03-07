import type { OutcomeSide, OrderSide } from "@/types/enums";

export interface TradeMathInput {
  collateral: number;
  leverage: number;
  entryPrice: number;
  side: OrderSide;
  outcome: OutcomeSide;
}

export const DEFAULT_TRADE_FEE_RATE = 0.0008;

export function calculateNotional(collateral: number, leverage: number): number {
  return Math.max(collateral, 0) * Math.max(leverage, 1);
}

export function calculateFeeEstimate(notional: number, feeRate = DEFAULT_TRADE_FEE_RATE): number {
  return notional * feeRate;
}

export function resolveFeeRate(feeRate: number | undefined): number {
  if (typeof feeRate !== "number") return DEFAULT_TRADE_FEE_RATE;
  return feeRate >= 0 ? feeRate : DEFAULT_TRADE_FEE_RATE;
}

export function calculateMarketPayment(collateral: number, feeEstimate: number): number {
  return Math.max(collateral, 0) + Math.max(feeEstimate, 0);
}

export function calculatePriceImpact(size: number, availableLiquidity = 250_000): number {
  if (availableLiquidity <= 0) return 0;
  return Math.min((size / availableLiquidity) * 100, 35);
}

export function calculateLiquidationPriceEstimate(input: TradeMathInput): number {
  const { entryPrice, leverage, side } = input;
  const cushion = 1 / Math.max(leverage, 1);

  if (side === "BUY") {
    return Math.max(0.01, entryPrice * (1 - cushion * 0.75));
  }

  return Math.min(0.99, entryPrice * (1 + cushion * 0.75));
}

export function calculateProjectedPnl(entryPrice: number, currentPrice: number, quantity: number, side: OrderSide): number {
  const delta = currentPrice - entryPrice;
  const signedDelta = side === "BUY" ? delta : -delta;
  return signedDelta * quantity;
}
