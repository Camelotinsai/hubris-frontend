import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const marketFiltersSource = readFileSync(new URL("../src/features/markets/components/MarketFilters.tsx", import.meta.url), "utf8");
const marketCardSource = readFileSync(new URL("../src/features/markets/components/MarketCard.tsx", import.meta.url), "utf8");
const topbarSource = readFileSync(new URL("../src/features/shell/Topbar.tsx", import.meta.url), "utf8");
const tradeValidationSource = readFileSync(new URL("../src/features/trade/validation.ts", import.meta.url), "utf8");
const tradeTicketSource = readFileSync(new URL("../src/features/trade/components/TradeTicket.tsx", import.meta.url), "utf8");
const portfolioPageSource = readFileSync(new URL("../src/features/portfolio/pages/PortfolioPage.tsx", import.meta.url), "utf8");

test("markets filters expose access scope controls for human-only discovery", () => {
  assert.match(marketFiltersSource, /Access/);
  assert.match(marketFiltersSource, /value="human-only"/);
  assert.match(marketFiltersSource, /value="standard"/);
});

test("trade validation blocks human-only orders when World ID is missing", () => {
  assert.match(tradeValidationSource, /market\??\.humanOnly/);
  assert.match(tradeValidationSource, /World ID verification is required for human-only markets\./);
});

test("topbar shows World ID badge only when verification is complete", () => {
  assert.match(topbarSource, /import\s+\{\s*WorldIdBadge\s*\}\s+from\s+["']@\/features\/auth\/WorldIdBadge["']/);
  assert.match(topbarSource, /const worldId = useWorldId\(\);/);
  assert.match(topbarSource, /worldId\.isVerified\s*&&\s*<WorldIdBadge\s*\/>/);
});

test("trade ticket has no direct World ID verify button", () => {
  assert.doesNotMatch(tradeTicketSource, /Verify with World ID/);
  assert.doesNotMatch(tradeTicketSource, /worldId\.verify/);
});

test("portfolio page surfaces World ID access state", () => {
  assert.match(portfolioPageSource, /World ID Access/);
  assert.match(portfolioPageSource, /Human-only market exposure/);
  assert.match(portfolioPageSource, /Verify with World ID/);
  assert.match(portfolioPageSource, /worldId\.isVerified\s*\?\s*<Badge variant="positive">World ID Verified<\/Badge>\s*:\s*null/);
});

test("human-only market join is gated with a verification popover", () => {
  assert.match(marketCardSource, /joinPopoverOpen/);
  assert.match(marketCardSource, /event\.preventDefault\(\)/);
  assert.match(marketCardSource, /Verify on Portfolio to join this human-only market\./);
  assert.match(marketCardSource, /to=\"\/portfolio\"/);
});
