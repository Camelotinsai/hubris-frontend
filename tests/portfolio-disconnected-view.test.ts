import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const portfolioPageSource = readFileSync(new URL("../src/features/portfolio/pages/PortfolioPage.tsx", import.meta.url), "utf8");

test("portfolio page renders header-only view when wallet is disconnected", () => {
  assert.match(portfolioPageSource, /const wallet = useWallet\(\);/);
  assert.match(
    portfolioPageSource,
    /if \(!wallet\.isConnected\) \{\s*return \(\s*<section className="space-y-6">\s*<PageHeader title="Portfolio" description="Exposure, margin, and settlement status in one operational view\." \/>/s
  );
});
