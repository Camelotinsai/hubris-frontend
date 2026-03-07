import type { Market } from "@/types/market";

import type { TradeTicketState } from "@/state/atoms/trade";

export function getEntryPrice(ticket: TradeTicketState, market: Market | undefined): number {
  if (!market) return ticket.limitPrice;

  if (ticket.type === "LIMIT") {
    return ticket.limitPrice;
  }

  return ticket.outcome === "YES" ? market.prices.yes : market.prices.no;
}
