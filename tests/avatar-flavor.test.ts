import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topbarSource = readFileSync(new URL("../src/features/shell/Topbar.tsx", import.meta.url), "utf8");
const sidebarSource = readFileSync(new URL("../src/features/shell/Sidebar.tsx", import.meta.url), "utf8");
const mobileNavSource = readFileSync(new URL("../src/features/shell/MobileNav.tsx", import.meta.url), "utf8");

test("topbar uses shared profile avatar for visual flavor", () => {
  assert.match(topbarSource, /import\s+\{[\s\S]*ProfileAvatar[\s\S]*\}\s+from\s+["']@\/features\/shared\/components\/ProfileAvatar["']/);
  assert.match(topbarSource, /SHARED_PROFILE_AVATAR_SEED/);
  assert.match(topbarSource, /import\s+\{\s*useWallet\s*\}\s+from\s+["']@\/hooks\/use-wallet["']/);
  assert.match(topbarSource, /const wallet = useWallet\(\);/);
  assert.match(topbarSource, /wallet\.isConnected\s*&&\s*\([\s\S]*<Link[\s\S]*<ProfileAvatar[^>]*\/>/);
});

test("portfolio nav items render profile avatar in desktop and mobile nav", () => {
  assert.match(sidebarSource, /import\s+\{[\s\S]*ProfileAvatar[\s\S]*\}\s+from\s+["']@\/features\/shared\/components\/ProfileAvatar["']/);
  assert.match(sidebarSource, /SHARED_PROFILE_AVATAR_SEED/);
  assert.match(sidebarSource, /link\.label\s*===\s*["']Portfolio["'][\s\S]*<ProfileAvatar[^>]*\/>/);

  assert.match(mobileNavSource, /import\s+\{[\s\S]*ProfileAvatar[\s\S]*\}\s+from\s+["']@\/features\/shared\/components\/ProfileAvatar["']/);
  assert.match(mobileNavSource, /SHARED_PROFILE_AVATAR_SEED/);
  assert.match(mobileNavSource, /link\.label\s*===\s*["']Portfolio["'][\s\S]*<ProfileAvatar[^>]*\/>/);
});
