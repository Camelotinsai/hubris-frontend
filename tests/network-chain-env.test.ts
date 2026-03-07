import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const networkBadgeSource = readFileSync(new URL("../src/features/auth/NetworkBadge.tsx", import.meta.url), "utf8");
const envSource = readFileSync(new URL("../src/lib/env.ts", import.meta.url), "utf8");
const envExampleSource = readFileSync(new URL("../.env.example", import.meta.url), "utf8");

test("network badge keeps ethereum styling simple and neon-accented", () => {
  assert.match(networkBadgeSource, /isEthereumChain/);
  assert.match(networkBadgeSource, /bg-black\/70/);
  assert.match(networkBadgeSource, /border-\[\#00f6ff\]\/40/);
  assert.match(networkBadgeSource, /text-\[\#9dfdff\]/);
  assert.doesNotMatch(networkBadgeSource, /via-\[\#ff00d4\]/);
});

test("env parser supports VITE_CHAIN alias selection", () => {
  assert.match(envSource, /VITE_CHAIN/);
  assert.match(envSource, /CHAIN_ALIASES/);
  assert.match(envSource, /ethereum/);
  assert.match(envSource, /sepolia/);
});

test("env example documents VITE_CHAIN usage", () => {
  assert.match(envExampleSource, /VITE_CHAIN=sepolia/);
});
