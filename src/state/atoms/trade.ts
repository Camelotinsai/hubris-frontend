import { atom } from "jotai";

import type { OrderSide, OrderType, OutcomeSide } from "@/types/enums";

export interface TradeTicketState {
  outcome: OutcomeSide;
  side: OrderSide;
  type: OrderType;
  leverage: number;
  collateral: number;
  quantity: number;
  limitPrice: number;
}

export const defaultTradeTicket: TradeTicketState = {
  outcome: "YES",
  side: "BUY",
  type: "MARKET",
  leverage: 5,
  collateral: 100,
  quantity: 500,
  limitPrice: 0.42
};

export const tradeTicketAtom = atom<TradeTicketState>(defaultTradeTicket);
