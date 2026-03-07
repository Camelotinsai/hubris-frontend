import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topbarSource = readFileSync(new URL("../src/features/shell/Topbar.tsx", import.meta.url), "utf8");

test("topbar does not render search command button", () => {
  assert.doesNotMatch(topbarSource, /import\s+\{\s*CommandMenu\s*\}\s+from/);
  assert.doesNotMatch(topbarSource, /<CommandMenu\s*\/>/);
});
