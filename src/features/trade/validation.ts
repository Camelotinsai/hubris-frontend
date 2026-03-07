import type { Market } from "@/types/market";

import type { TradeTicketState } from "@/state/atoms/trade";

export interface TradeValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface TradeValidationContext {
  worldIdVerified?: boolean;
}

export function validateTradeTicket(
  ticket: TradeTicketState,
  market: Market | undefined,
  context?: TradeValidationContext
): TradeValidationResult {
  const errors: string[] = [];

  if (!market) {
    errors.push("Market context unavailable.");
  }

  if (market && market.status !== "active") {
    errors.push(`Market is ${market.status}. New orders are disabled.`);
  }

  if (ticket.collateral <= 0) {
    errors.push("Collateral must be greater than zero.");
  }

  if (ticket.quantity <= 0) {
    errors.push("Order size must be greater than zero.");
  }

  if (ticket.leverage < 1) {
    errors.push("Leverage must be at least 1x.");
  }

  if (market && ticket.leverage > market.leverageCap) {
    errors.push(`Leverage exceeds cap (${market.leverageCap}x).`);
  }

  if (market?.humanOnly && !context?.worldIdVerified) {
    errors.push("World ID verification is required for human-only markets.");
  }

  if (ticket.type === "LIMIT" && (ticket.limitPrice <= 0 || ticket.limitPrice >= 1)) {
    errors.push("Limit price must be between 0 and 1.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
