import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topbarSource = readFileSync(new URL("../src/features/shell/Topbar.tsx", import.meta.url), "utf8");
const portfolioPageSource = readFileSync(new URL("../src/features/portfolio/pages/PortfolioPage.tsx", import.meta.url), "utf8");
const avatarSource = readFileSync(new URL("../src/features/shared/components/ProfileAvatar.tsx", import.meta.url), "utf8");

test("avatar upload controls live in portfolio page only", () => {
  assert.match(topbarSource, /Link to="\/portfolio"[\s\S]*<ProfileAvatar/);
  assert.doesNotMatch(topbarSource, /type="file"/);
  assert.doesNotMatch(topbarSource, /Upload Avatar/);
  assert.doesNotMatch(topbarSource, /Reset Avatar/);

  assert.match(portfolioPageSource, /type="file"/);
  assert.match(portfolioPageSource, /accept="image\/\*"/);
  assert.match(portfolioPageSource, /Upload Avatar/);
  assert.match(portfolioPageSource, /Reset Avatar/);
});

test("profile avatar renders uploaded image when present", () => {
  assert.match(avatarSource, /profileAvatarDataUrlAtom/);
  assert.match(avatarSource, /<img/);
  assert.match(avatarSource, /alt="Profile avatar"/);
});
