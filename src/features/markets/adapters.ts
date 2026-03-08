import type { Market } from "@/types/market";

export interface MarketRelatedOutcomeModel {
  marketId: string;
  label: string;
  probability: number;
  status: Market["status"];
}

export interface MarketCardModel {
  id: string;
  question: string;
  imageUrl?: string;
  imageAlt?: string;
  category: string;
  status: Market["status"];
  yesPrice: number;
  noPrice: number;
  resolutionTime: string;
  leverageCap: number;
  humanOnly: boolean;
  feeRate: number;
  feeDiscountPct: number;
  volume24h: number;
  openInterest: number;
  fundingRateBps: number;
  layout: "binary" | "multi";
  primaryMarketId: string;
  relatedOutcomes?: MarketRelatedOutcomeModel[];
}

export function toMarketCardModel(market: Market): MarketCardModel {
  return {
    id: market.id,
    question: market.question,
    imageUrl: market.imageUrl,
    imageAlt: market.imageAlt,
    category: market.category,
    status: market.status,
    yesPrice: market.prices.yes,
    noPrice: market.prices.no,
    resolutionTime: market.resolutionTime,
    leverageCap: market.leverageCap,
    humanOnly: Boolean(market.humanOnly),
    feeRate: market.feeRate ?? 0.0008,
    feeDiscountPct: market.feeDiscountPct ?? 0,
    volume24h: market.stats.volume24h ?? 100000,
    openInterest: market.stats.openInterest ?? 500000,
    fundingRateBps: market.stats.fundingRateBps ?? 0,
    layout: "binary",
    primaryMarketId: market.id
  };
}

function resolveGroupedStatus(markets: Market[]): Market["status"] {
  if (markets.some((item) => item.status === "active")) return "active";
  if (markets.some((item) => item.status === "paused")) return "paused";
  if (markets.some((item) => item.status === "resolved")) return "resolved";
  return "cancelled";
}

function toGroupedCardModel(groupId: string, markets: Market[]): MarketCardModel {
  const rows = [...markets].sort((a, b) => (a.outcomeBandOrder ?? 0) - (b.outcomeBandOrder ?? 0));
  const lead = rows[0];

  if (!lead) {
    throw new Error(`Grouped market ${groupId} has no rows.`);
  }

  const totalOpenInterest = rows.reduce((sum, item) => sum + (item.stats.openInterest ?? 0), 0);
  const weightedFundingBps =
    totalOpenInterest > 0
      ? rows.reduce((sum, item) => sum + (item.stats.fundingRateBps ?? 0) * (item.stats.openInterest ?? 0), 0) / totalOpenInterest
      : rows.reduce((sum, item) => sum + (item.stats.fundingRateBps ?? 0), 0) / rows.length;

  return {
    id: groupId,
    question: lead.groupQuestion ?? lead.question,
    imageUrl: lead.imageUrl,
    imageAlt: lead.imageAlt,
    category: lead.category,
    status: resolveGroupedStatus(rows),
    yesPrice: lead.prices.yes,
    noPrice: lead.prices.no,
    resolutionTime: lead.resolutionTime,
    leverageCap: Math.max(...rows.map((item) => item.leverageCap)),
    humanOnly: rows.every((item) => Boolean(item.humanOnly)),
    feeRate: Math.min(...rows.map((item) => item.feeRate ?? 0.0008)),
    feeDiscountPct: Math.max(...rows.map((item) => item.feeDiscountPct ?? 0)),
    volume24h: rows.reduce((sum, item) => sum + (item.stats.volume24h ?? 0), 0),
    openInterest: rows.reduce((sum, item) => sum + (item.stats.openInterest ?? 0), 0),
    fundingRateBps: weightedFundingBps,
    layout: "multi",
    primaryMarketId: lead.id,
    relatedOutcomes: rows.map((item) => ({
      marketId: item.id,
      label: item.outcomeBandLabel ?? item.question,
      probability: item.prices.yes,
      status: item.status
    }))
  };
}

export function toMarketCardModels(markets: Market[]): MarketCardModel[] {
  const grouped = new Map<string, Market[]>();
  markets.forEach((market) => {
    if (!market.outcomeGroupId) return;

    const rows = grouped.get(market.outcomeGroupId) ?? [];
    rows.push(market);
    grouped.set(market.outcomeGroupId, rows);
  });

  const cards: MarketCardModel[] = [];
  const renderedGroups = new Set<string>();

  markets.forEach((market) => {
    if (!market.outcomeGroupId) {
      cards.push(toMarketCardModel(market));
      return;
    }

    if (renderedGroups.has(market.outcomeGroupId)) {
      return;
    }

    const rows = grouped.get(market.outcomeGroupId);
    if (!rows || rows.length === 0) {
      cards.push(toMarketCardModel(market));
      return;
    }

    cards.push(toGroupedCardModel(market.outcomeGroupId, rows));
    renderedGroups.add(market.outcomeGroupId);
  });

  return cards;
}
