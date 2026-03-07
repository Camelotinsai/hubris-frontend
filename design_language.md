# HUBRIS Design Language

Version: 2026-03-07-e
Scope: `hubris-frontend` application UI only

## Critique Of Previous Pass

1. Surface grammar was inconsistent.
Cards, headers, nav shells, and empty/error states used different depth and edge treatments.

2. Color semantics were diluted.
Global background used both green and red accents, which weakened red as a risk-only signal.

3. Data rhythm was uneven.
Numeric-heavy areas (trading + portfolio) did not consistently use tabular number styling.

4. Brand voice was present but not fully systematized.
The tone existed in copy, but visual motifs (threshold line, elevated surface, boundary edge) were not applied uniformly.

## Core Principles

1. Monochrome first, signal color second.
Primary emphasis: `#00FF88`.
Risk emphasis only: `#FF3344`.
No decorative red ambient effects.

2. Rounded but severe.
Use rounded corners for polish (`xl/2xl`) while keeping typography uppercase, high-tracking, and technically cold.

3. One surface hierarchy.
All primary panels must read as the same family:
- gradient micro-surface
- thin boundary line
- subtle threshold top-line motif
- controlled shadow

4. Numeric clarity is a feature.
Trading and portfolio values use tabular numeric rendering for fast scan and reduced visual jitter.

5. Motion is restrained.
Short, purpose-driven transitions only; no decorative loops/parallax.

## Tokens

- Background: `--color-bg`
- Surface: `--color-panel`, `--color-panel-2`
- Boundary: `--color-line`, `--color-line-strong`
- Text: `--color-text`, `--color-muted`
- Positive: `--color-positive`
- Risk: `--color-risk`
- Radius baseline: `--radius: 16px`

## Component Rules

### Buttons
- Rounded (`rounded-xl`)
- Uppercase label
- `primary` = positive signal with glow
- `risk` reserved for destructive/risk actions

### Cards / Section Containers
- Must use unified panel-surface style
- Rounded-2xl
- Subtle threshold line at top edge

### Market Card Media
- Every market card includes a fixed media slot (`h-28`) above metadata.
- Media slot is image-ready: prefer real-world market imagery when available, otherwise render category-tinted fallback.
- Overlay must preserve readability: dark top/bottom gradient + compact tag.
- Keep imagery informational and market-adjacent (institutions, venues, trading context), never fantasy or meme style.

### Outcome Controls
- `YES` controls use positive green semantics.
- `NO` controls use risk red semantics consistently across market cards and trade toggles.
- Do not render neutral `NO` action buttons in primary interaction zones.

### Multi-Outcome Presentation
- Multi-outcome markets are represented as related binary sub-markets grouped under one parent question.
- Each row exposes a band label, current probability, and explicit `Yes`/`No` entry actions.
- Group cards are scan-first; execution still routes to a concrete underlying market.

### Inputs / Select / Tabs
- Rounded-xl
- Same height rhythm (`h-10` / `h-11` / `h-12`)
- Boundary-first styling, no soft pastel fills

### Tables
- Rounded outer container
- Tabular numeric cell rendering
- Thin boundary separators

### App Shell
- Topbar/Sidebar/MobileNav must visually belong to same system:
  rounded shell + thin line + dark panel background
- Disconnected wallet state must render a dedicated status surface before page content.
- This surface must be operational: state label, supported-chain context, and direct connect CTA.

## Copy Tone Rules

- Short, declarative, technical
- No playful financial language
- No hype punctuation
- Keep risk copy explicit and unsentimental

## Change Log

### 2026-03-07-a
- Removed decorative red ambient glow from global background
- Unified panel surfaces and threshold motif
- Enforced rounded shadcn primitives across key controls
- Added tabular numeric treatment (`kpi-number`) for operational clarity
- Harmonized shell + route-level containers with one surface language

### 2026-03-07-b
- Added fixed media slots to market cards for image-forward scanning
- Added local abstract market media assets in `/public/market-media`
- Added category-based media fallback gradients for image resilience

### 2026-03-07-c
- Replaced abstract mock card media with real-world web-sourced market photos for stronger scanability
- Added runtime image-failure handling in market cards
- Preserved blended-color fallback surfaces to keep visual continuity when remote media is unavailable

### 2026-03-07-d
- Added a global disconnected-wallet status banner across all routes in the app shell
- Added explicit supported-chain chips in disconnected state to guide connection intent
- Updated network badge semantics to display real chain names (Ethereum, Base, Arbitrum, Sepolia) and unsupported-chain status

### 2026-03-07-e
- Applied red risk semantics to `NO` outcome controls in trade and market interaction surfaces
- Added grouped multi-outcome market card support (related binary sub-markets under one question)
- Added Solana outcome-band mock markets to demonstrate multi-outcome scanning and routing behavior
