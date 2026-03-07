import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

const runnerPath = new URL("../scripts/with-test-host.sh", import.meta.url);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const markerProcessExists = (marker: string) => {
  const ps = spawnSync("ps", ["-eo", "command"], { encoding: "utf8" });
  return ps.stdout.split("\n").some((line) => line.includes(marker));
};

test("test host runner always tears down host process after task completion", async () => {
  const marker = `test-host-marker-${Date.now()}-${process.pid}`;
  const hostCommand = `node -e "setInterval(() => {}, 1000)" "${marker}"`;

  const result = spawnSync(
    "bash",
    [
      runnerPath.pathname,
      "--host-cmd",
      hostCommand,
      "--",
      "node",
      "-e",
      "setTimeout(() => process.exit(0), 50)"
    ],
    {
      encoding: "utf8",
      timeout: 15000
    }
  );

  assert.equal(
    result.status,
    0,
    `runner exited with non-zero status\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
  );

  const deadline = Date.now() + 3000;
  while (Date.now() < deadline) {
    if (!markerProcessExists(marker)) {
      return;
    }
    await sleep(100);
  }

  assert.equal(markerProcessExists(marker), false, `host marker process still running: ${marker}`);
});
