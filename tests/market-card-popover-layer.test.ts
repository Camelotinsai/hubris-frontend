import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const marketCardSource = readFileSync(new URL("../src/features/markets/components/MarketCard.tsx", import.meta.url), "utf8");
const appShellSource = readFileSync(new URL("../src/features/shell/AppShell.tsx", import.meta.url), "utf8");

test("app shell provides a shared popover layer context", () => {
  assert.match(appShellSource, /PopoverLayerProvider/);
  assert.match(appShellSource, /<PopoverLayerProvider>/);
});

test("market card verification popover is rendered in a portal layer above the trigger", () => {
  assert.match(marketCardSource, /createPortal\(/);
  assert.match(marketCardSource, /usePopoverLayer/);
  assert.match(marketCardSource, /className="fixed z-50/);
  assert.match(marketCardSource, /translateY\(calc\(-100% - 0\.5rem\)\)/);
});
