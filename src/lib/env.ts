const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
const CHAIN_ALIASES: Record<string, number> = {
  ethereum: 1,
  mainnet: 1,
  base: 8453,
  arbitrum: 42161,
  sepolia: 11155111
};

type EnvMap = Record<string, string | undefined>;
type WorldIdEnvironment = "production" | "staging";

function read(raw: EnvMap, key: string, fallback: string): string {
  const value = raw[key];
  return value && value.length > 0 ? value : fallback;
}

function readNumber(raw: EnvMap, key: string, fallback: number): number {
  const value = raw[key];
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readBool(raw: EnvMap, key: string, fallback: boolean): boolean {
  const value = raw[key]?.toLowerCase();
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function readWorldIdEnvironment(raw: EnvMap, key: string): WorldIdEnvironment {
  const value = raw[key]?.toLowerCase();
  return value === "staging" ? "staging" : "production";
}

function readCsvNumbers(raw: EnvMap, key: string, fallback: number[]): number[] {
  const value = raw[key];
  if (!value) return fallback;

  const parsed = value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item > 0);

  return parsed.length > 0 ? parsed : fallback;
}

function readChainAlias(raw: EnvMap, key: string): number | undefined {
  const alias = raw[key]?.trim().toLowerCase();
  if (!alias) return undefined;
  return CHAIN_ALIASES[alias];
}

function readAddress(raw: EnvMap, key: string, fallback: `0x${string}`): `0x${string}` {
  const value = raw[key];
  if (!value) return fallback;
  if (!value.startsWith("0x") || value.length !== 42) return fallback;
  return value as `0x${string}`;
}

function defaultRpcFor(chainId: number): string {
  switch (chainId) {
    case 1:
      return "https://rpc.ankr.com/eth";
    case 8453:
      return "https://mainnet.base.org";
    case 42161:
      return "https://arb1.arbitrum.io/rpc";
    case 11155111:
      return "https://rpc.sepolia.org";
    default:
      return "https://rpc.ankr.com/eth";
  }
}

function defaultExplorerFor(chainId: number): string {
  switch (chainId) {
    case 1:
      return "https://etherscan.io";
    case 8453:
      return "https://basescan.org";
    case 42161:
      return "https://arbiscan.io";
    case 11155111:
      return "https://sepolia.etherscan.io";
    default:
      return "https://etherscan.io";
  }
}

const raw = import.meta.env as EnvMap;

const aliasChainId = readChainAlias(raw, "VITE_CHAIN");
const legacyChainId = readNumber(raw, "VITE_CHAIN_ID", aliasChainId ?? 11155111);
const fallbackChainId = aliasChainId ?? legacyChainId;
const availableChains = readCsvNumbers(raw, "VITE_AVAILABLE_CHAINS", [fallbackChainId]);
const defaultChainId = readNumber(raw, "VITE_DEFAULT_CHAIN_ID", fallbackChainId);
const chainId = availableChains.includes(defaultChainId) ? defaultChainId : availableChains[0] ?? fallbackChainId;

const rpcUrls = Object.fromEntries(
  availableChains.map((id) => {
    const rpc = read(raw, `VITE_RPC_URL_${id}`, read(raw, "VITE_RPC_URL", defaultRpcFor(id)));
    return [id, rpc];
  })
) as Record<number, string>;

const explorerUrls = Object.fromEntries(
  availableChains.map((id) => {
    const explorer = read(raw, `VITE_BLOCK_EXPLORER_URL_${id}`, defaultExplorerFor(id));
    return [id, explorer];
  })
) as Record<number, string>;

function chainAddress(key: string): `0x${string}` {
  return readAddress(
    raw,
    `${key}_${chainId}`,
    readAddress(raw, key, ZERO_ADDRESS)
  );
}

export const env = {
  mockData: readBool(raw, "VITE_MOCK_DATA", true),
  availableChains,
  chainId,
  rpcUrl: rpcUrls[chainId] ?? defaultRpcFor(chainId),
  rpcUrls,
  explorerUrl: explorerUrls[chainId] ?? defaultExplorerFor(chainId),
  explorerUrls,
  apiBaseUrl: read(raw, "VITE_API_BASE_URL", "https://api.hubris.example"),
  wsUrl: read(raw, "VITE_WS_URL", "wss://api.hubris.example/ws"),
  apiTimeoutMs: readNumber(raw, "VITE_API_TIMEOUT_MS", 12_000),
  enableWs: readBool(raw, "VITE_ENABLE_WS", true),
  worldId: {
    appId: read(raw, "VITE_WORLD_ID_APP_ID", ""),
    action: read(raw, "VITE_WORLD_ID_ACTION", ""),
    allowLegacyProofs: readBool(raw, "VITE_WORLD_ID_ALLOW_LEGACY_PROOFS", true),
    environment: readWorldIdEnvironment(raw, "VITE_WORLD_ID_ENVIRONMENT")
  },
  endpoints: {
    markets: read(raw, "VITE_ENDPOINT_MARKETS", "/markets"),
    orders: read(raw, "VITE_ENDPOINT_ORDERS", "/orders"),
    positions: read(raw, "VITE_ENDPOINT_POSITIONS", "/positions"),
    portfolio: read(raw, "VITE_ENDPOINT_PORTFOLIO", "/portfolio"),
    shares: read(raw, "VITE_ENDPOINT_SHARES", "/shares"),
    worldIdSignature: read(raw, "VITE_ENDPOINT_WORLD_ID_SIGNATURE", "/world-id/rp-signature"),
    worldIdVerify: read(raw, "VITE_ENDPOINT_WORLD_ID_VERIFY", "/world-id/verify")
  },
  contracts: {
    marketFactory: chainAddress("VITE_MARKET_FACTORY_ADDRESS"),
    feeManager: chainAddress("VITE_FEE_MANAGER_ADDRESS"),
    vault: chainAddress("VITE_VAULT_ADDRESS"),
    usdc: chainAddress("VITE_USDC_ADDRESS"),
    orderBook: chainAddress("VITE_ORDERBOOK_ADDRESS"),
    predictionMarket: chainAddress("VITE_PREDICTION_MARKET_ADDRESS"),
    shareToken: chainAddress("VITE_SHARE_TOKEN_ADDRESS")
  }
};
