import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const envSource = readFileSync(new URL("../src/lib/env.ts", import.meta.url), "utf8");
const envExampleSource = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
const worldIdHookSource = readFileSync(new URL("../src/hooks/use-world-id.ts", import.meta.url), "utf8");

test("env parser exposes world id runtime keys", () => {
  assert.match(envSource, /VITE_WORLD_ID_APP_ID/);
  assert.match(envSource, /VITE_WORLD_ID_ACTION/);
  assert.match(envSource, /VITE_ENDPOINT_WORLD_ID_SIGNATURE/);
  assert.match(envSource, /VITE_ENDPOINT_WORLD_ID_VERIFY/);
});

test("env example documents world id configuration", () => {
  assert.match(envExampleSource, /VITE_WORLD_ID_APP_ID=app_/);
  assert.match(envExampleSource, /VITE_WORLD_ID_ACTION=/);
  assert.match(envExampleSource, /VITE_ENDPOINT_WORLD_ID_SIGNATURE=/);
  assert.match(envExampleSource, /VITE_ENDPOINT_WORLD_ID_VERIFY=/);
});

test("world id hook uses idkit request flow and backend verification", () => {
  assert.match(worldIdHookSource, /useIDKitRequest/);
  assert.match(worldIdHookSource, /flow\.open\(\)/);
  assert.match(worldIdHookSource, /rp_context/);
  assert.match(worldIdHookSource, /worldIdSignature/);
  assert.match(worldIdHookSource, /worldIdVerify/);
});
