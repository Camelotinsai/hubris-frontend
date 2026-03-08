import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appShellSource = readFileSync(new URL("../src/features/shell/AppShell.tsx", import.meta.url), "utf8");
const tradeTicketSource = readFileSync(new URL("../src/features/trade/components/TradeTicket.tsx", import.meta.url), "utf8");
const notificationViewportSource = readFileSync(
  new URL("../src/features/shell/NotificationViewport.tsx", import.meta.url),
  "utf8"
);

test("app shell mounts global notification viewport", () => {
  assert.match(appShellSource, /import\s+\{\s*NotificationViewport\s*\}\s+from\s+["']@\/features\/shell\/NotificationViewport["']/);
  assert.match(appShellSource, /<NotificationViewport\s*\/>/);
});

test("notification viewport is anchored bottom-right", () => {
  assert.match(notificationViewportSource, /fixed/);
  assert.match(notificationViewportSource, /bottom-4/);
  assert.match(notificationViewportSource, /right-4/);
});

test("trade ticket sends market order status notifications", () => {
  assert.match(tradeTicketSource, /import\s+\{\s*useNotifications\s*\}\s+from\s+["']@\/hooks\/use-notifications["']/);
  assert.match(tradeTicketSource, /notifySuccess\(/);
  assert.match(tradeTicketSource, /notifyError\(/);
  assert.match(tradeTicketSource, /Market order submitted/);
});
