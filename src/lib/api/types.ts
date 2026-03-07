import type { Market, MarketFilter } from "@/types/market";
import type { Order, Orderbook, TradePrint } from "@/types/order";
import type { PortfolioSummary } from "@/types/portfolio";
import type { Position, ShareBalance } from "@/types/position";
import type { ResolutionState } from "@/types/resolution";

export interface MarketsResponse {
  data: Market[];
}

export interface MarketDetailResponse {
  data: Market;
}

export interface MarketListRequest {
  filter?: MarketFilter;
}

export interface OrderbookResponse {
  data: Orderbook;
}

export interface RecentTradesResponse {
  data: TradePrint[];
}

export interface OrdersResponse {
  data: Order[];
}

export interface PositionsResponse {
  data: Position[];
}

export interface ShareBalancesResponse {
  data: ShareBalance[];
}

export interface PortfolioResponse {
  data: PortfolioSummary;
}

export interface ResolutionResponse {
  data: ResolutionState;
}
