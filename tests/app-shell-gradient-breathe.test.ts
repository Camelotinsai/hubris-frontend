import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appShellSource = readFileSync(new URL("../src/features/shell/AppShell.tsx", import.meta.url), "utf8");
const tailwindConfigSource = readFileSync(new URL("../tailwind.config.ts", import.meta.url), "utf8");

test("app shell renders an animated breathing gradient background layer", () => {
  assert.match(appShellSource, /animate-gradient-breathe/);
  assert.match(appShellSource, /bg-gradient-to-br/);
  assert.match(appShellSource, /min-h-screen\s+relative\s+isolate\s+bg-bg\s+text-text/);
  assert.match(appShellSource, /fixed inset-0 z-0 overflow-hidden/);
  assert.doesNotMatch(appShellSource, /fixed inset-0 -z-10 overflow-hidden/);
});

test("tailwind defines a gradient-breathe animation", () => {
  assert.match(tailwindConfigSource, /"gradient-breathe"/);
  assert.match(tailwindConfigSource, /animation:\s*\{[\s\S]*"gradient-breathe"\s*:\s*"gradient-breathe\s+12s\s+ease-in-out\s+infinite"/);
  assert.match(tailwindConfigSource, /keyframes:\s*\{[\s\S]*"gradient-breathe"\s*:/);
});
