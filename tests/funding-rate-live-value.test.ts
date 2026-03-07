import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const marketTypesSource = readFileSync(new URL("../src/types/market.ts", import.meta.url), "utf8");
const marketAdaptersSource = readFileSync(new URL("../src/features/markets/adapters.ts", import.meta.url), "utf8");
const marketCardSource = readFileSync(new URL("../src/features/markets/components/MarketCard.tsx", import.meta.url), "utf8");
const marketHeaderSource = readFileSync(new URL("../src/features/trade/components/MarketHeader.tsx", import.meta.url), "utf8");
const marketHookSource = readFileSync(new URL("../src/hooks/use-market.ts", import.meta.url), "utf8");
const marketListHookSource = readFileSync(new URL("../src/hooks/use-market-list.ts", import.meta.url), "utf8");

test("market data model includes funding rate in stats", () => {
  assert.match(marketTypesSource, /fundingRateBps\?: number;/);
});

test("market adapters expose funding rate for cards", () => {
  assert.match(marketAdaptersSource, /fundingRateBps: number;/);
  assert.match(marketAdaptersSource, /fundingRateBps: market\.stats\.fundingRateBps \?\? 0,/);
});

test("markets and trade surfaces render funding labels", () => {
  assert.match(marketCardSource, /Funding/);
  assert.match(marketHeaderSource, /Funding/);
});

test("market queries refetch for live funding updates", () => {
  assert.match(marketHookSource, /refetchInterval:\s*\d+/);
  assert.match(marketListHookSource, /refetchInterval:\s*\d+/);
});
