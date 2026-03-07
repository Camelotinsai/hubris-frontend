import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const outcomeToggleSource = readFileSync(
  new URL("../src/features/trade/components/OutcomeToggle.tsx", import.meta.url),
  "utf8"
);
const marketCardSource = readFileSync(
  new URL("../src/features/markets/components/MarketCard.tsx", import.meta.url),
  "utf8"
);

test("trade outcome toggle has directional hover feedback for YES and NO", () => {
  assert.match(outcomeToggleSource, /hover:border-risk\/70 hover:bg-risk\/10 hover:text-risk/);
  assert.match(outcomeToggleSource, /hover:border-positive\/70 hover:bg-positive\/10 hover:text-positive/);
});

test("binary market card entry buttons have hover color wash for YES and NO", () => {
  assert.match(marketCardSource, /outcome=YES[\s\S]*hover:border-positive\/70 hover:bg-positive\/10 hover:brightness-110/);
  assert.match(marketCardSource, /outcome=NO[\s\S]*hover:border-risk\/70 hover:bg-risk\/10 hover:brightness-110/);
});
