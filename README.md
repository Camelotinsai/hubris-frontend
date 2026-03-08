# Hubris Frontend

Hubris Frontend is a Vite + React 19 application for the Hubris prediction-market trading experience.
It includes markets discovery, trade execution UI, portfolio views, wallet connectivity, and backend/websocket data integration hooks.

## Stack

- React 19 + TypeScript
- Vite 6
- React Router 7
- TanStack Query
- Wagmi + Viem
- Tailwind CSS + Radix UI
- Jotai state atoms

## App Routes

- `/` and `/markets`: markets list and filtering
- `/trade/:marketId`: trade terminal and orderbook
- `/portfolio`: positions, open orders, balances

## Getting Started

```bash
cd hubris-frontend
npm install
cp .env.example .env.local
npm run dev
```

Default dev host is shown by Vite output.  
If you need the fixed host/port used by automation, run:

```bash
npm run execute
```

## Available Scripts

- `npm run dev`: start Vite dev server
- `npm run execute`: start Vite at `127.0.0.1:4173`
- `npm run build`: type-check project references and create production build
- `npm run preview`: preview production build locally
- `npm run typecheck`: run TypeScript checks without emitting files
- `npm run lint`: run ESLint
- `npm run test`: run Node test suite in `tests/**/*.test.ts`
- `npm run test:host`: run tests with a managed dev host (`scripts/with-test-host.sh`)

## Environment Configuration

Use `.env.example` as the source of truth.

Key groups:

- Runtime mode: `VITE_MOCK_DATA`, `VITE_ENABLE_WS`, `VITE_API_TIMEOUT_MS`
- Chains and RPC: `VITE_CHAIN`, `VITE_AVAILABLE_CHAINS`, `VITE_DEFAULT_CHAIN_ID`, `VITE_RPC_URL_*`
- Explorer URLs: `VITE_BLOCK_EXPLORER_URL_*`
- Backend endpoints: `VITE_API_BASE_URL`, `VITE_WS_URL`, `VITE_ENDPOINT_*`
- Contracts: chain-specific `VITE_*_ADDRESS_<CHAIN_ID>` plus legacy fallback `VITE_*_ADDRESS`

Config parsing lives in `src/lib/env.ts`.

## Integration Notes

- Backend contract/API expectations: see [`../docs/hubris-contract-backend-integration-guide.md`](../docs/hubris-contract-backend-integration-guide.md)
- Trade submission and World ID verification are currently mocked in frontend flows and should be replaced for production integration.
- API client currently supports mock fallback behavior; confirm desired strictness before go-live.

## Managed Host Testing

Repository policy requires managed host lifecycle for test tasks.
Use `npm run test:host` (or `scripts/with-test-host.sh`) instead of unmanaged background servers.

The wrapper ensures:

- teardown on success, failure, timeout, `INT`, and `TERM`
- process-group cleanup (prevents orphan child processes)

## Project Structure

- `src/app`: app shell, router, route entry points
- `src/features`: domain modules (`markets`, `trade`, `portfolio`, `resolution`, `auth`)
- `src/lib`: API, env, analytics, web3 config, utilities
- `src/state`: shared atoms
- `tests`: node-based integration/regression tests
- `scripts/with-test-host.sh`: managed host runner for task/test commands
