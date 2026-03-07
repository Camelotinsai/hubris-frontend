import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const marketCardSource = readFileSync(new URL("../src/features/markets/components/MarketCard.tsx", import.meta.url), "utf8");

test("market card defines category color map for animated aura", () => {
  assert.match(marketCardSource, /const cardAuraByCategory: Record<string, string> = \{/);
  assert.match(marketCardSource, /Crypto:\s*"from-emerald-400\/16 via-transparent to-cyan-300\/14"/);
  assert.match(marketCardSource, /Politics:\s*"from-emerald-300\/16 via-transparent to-sky-300\/14"/);
  assert.match(marketCardSource, /Sports:\s*"from-sky-300\/18 via-transparent to-indigo-300\/14"/);
});

test("market card renders breathing gradient aura behind card content", () => {
  assert.match(marketCardSource, /<Card className="relative h-full overflow-hidden bg-gradient-to-b from-panel2\/70 to-panel">/);
  assert.match(marketCardSource, /cardAuraByCategory\[market\.category\] \?\? "from-zinc-300\/16 via-transparent to-zinc-400\/12"/);
  assert.match(marketCardSource, /animate-gradient-breathe/);
  assert.match(marketCardSource, /\[animation-delay:1\.2s\]/);
  assert.match(marketCardSource, /<div className="relative z-\[1\]">/);
});
