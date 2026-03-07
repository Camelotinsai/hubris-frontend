import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DEFAULT_MARKET_IMAGE_FALLBACK,
  getMarketImageFallback,
  resolveMarketImageSrc
} from "../src/features/markets/image-fallback.ts";

const marketCardSource = readFileSync(new URL("../src/features/markets/components/MarketCard.tsx", import.meta.url), "utf8");
const tradeTicketSource = readFileSync(new URL("../src/features/trade/components/TradeTicket.tsx", import.meta.url), "utf8");

test("market cards do not render signal surface badge", () => {
  assert.doesNotMatch(marketCardSource, /Signal Surface/);
});

test("market images fall back to category placeholder when missing or broken", () => {
  assert.equal(getMarketImageFallback("Crypto"), "/market-media/crypto.svg");
  assert.equal(getMarketImageFallback("Sports"), "/market-media/sports.svg");
  assert.equal(getMarketImageFallback("Unknown"), DEFAULT_MARKET_IMAGE_FALLBACK);

  assert.equal(resolveMarketImageSrc(undefined, "Tech", false), "/market-media/tech.svg");
  assert.equal(resolveMarketImageSrc("https://cdn.example.com/market.jpg", "Tech", false), "https://cdn.example.com/market.jpg");
  assert.equal(resolveMarketImageSrc("https://cdn.example.com/market.jpg", "Tech", true), "/market-media/tech.svg");
});

test("trade ticket image falls back instead of rendering broken alt text", () => {
  assert.match(tradeTicketSource, /resolveMarketImageSrc/);
  assert.match(tradeTicketSource, /const \[imageFailed, setImageFailed\] = useState\(false\);/);
  assert.match(tradeTicketSource, /src=\{imageSrc\}/);
  assert.match(tradeTicketSource, /onError=\{\(\) => \{/);
  assert.match(tradeTicketSource, /setImageFailed\(true\);/);
});
