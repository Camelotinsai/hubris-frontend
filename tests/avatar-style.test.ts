import assert from "node:assert/strict";
import test from "node:test";

import { createAvatarBlend } from "../src/features/shared/components/avatar-style.ts";

test("avatar blend is deterministic for the same seed", () => {
  const first = createAvatarBlend("hubris");
  const second = createAvatarBlend("hubris");

  assert.deepEqual(first, second);
});

test("avatar blend varies across different seeds", () => {
  const first = createAvatarBlend("hubris");
  const second = createAvatarBlend("portfolio");

  assert.notEqual(first.backgroundImage, second.backgroundImage);
});

test("avatar blend creates layered gradients for a metamask-like look", () => {
  const blend = createAvatarBlend("wallet-user");

  assert.match(blend.backgroundImage, /radial-gradient/);
  assert.match(blend.backgroundImage, /conic-gradient/);
  assert.doesNotMatch(blend.backgroundImage, /transparent/i);
  assert.doesNotMatch(blend.backgroundImage, /#06060a|#020206|#080913|#090a14/i);
  assert.match(blend.backgroundImage, /#00f6ff/i);
  assert.match(blend.backgroundImage, /#ff00d4/i);
  assert.match(blend.backgroundImage, /#ffe600/i);
  assert.match(blend.backgroundImage, /#3f48ff/i);
  assert.notEqual(blend.backgroundColor, "#040507");
});
