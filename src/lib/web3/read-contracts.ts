/**
 * read-contracts.ts
 *
 * Plain async helpers that read Hubris contracts using wagmi/actions.
 * Safe to call from react-query queryFn, outside React components.
 *
 * Unit conventions (matching contracts):
 *   WAD  = 1e18  → prices, leverage, rates  (divide by 1e18 for human value)
 *   USDC = 1e6   → balances, margins, fees  (divide by 1e6 for human value)
 */

import { readContract, readContracts, getAccount } from "wagmi/actions";
import { formatUnits } from "viem";

import { wagmiConfig } from "@/lib/web3/config";
import { env } from "@/lib/env";
import {
  vaultAbi,
  orderBookAbi,
  predictionMarketAbi,
  marketFactoryAbi,
  shareTokenAbi,
  erc20Abi
} from "@/lib/web3/abis";

import type { Position, ShareBalance } from "@/types/position";
import type { Order, Orderbook, OrderbookLevel, TradePrint } from "@/types/order";
import type { PortfolioSummary } from "@/types/portfolio";
import type { Market } from "@/types/market";
import type { MarketStatus } from "@/types/enums";

// ─── Address helpers ────────────────────────────────────────────────────────

const FACTORY = env.contracts.marketFactory as `0x${string}`;
const VAULT = env.contracts.vault as `0x${string}`;
const USDC = env.contracts.usdc as `0x${string}`;

const WAD = BigInt("1000000000000000000"); // 1e18
const USDC_DECIMALS = 6;
const WAD_DECIMALS = 18;

export function wadToNumber(n: bigint): number {
  if (n == null) return 0;
  return Number(formatUnits(n, WAD_DECIMALS));
}

export function usdcToNumber(n: bigint): number {
  if (n == null) return 0;
  return Number(formatUnits(n, USDC_DECIMALS));
}

export function signedWadToNumber(n: bigint): number {
  if (n == null) return 0;
  // Handle negative BigInt for int256
  return Number(formatUnits(n, WAD_DECIMALS));
}

export function signedUsdcToNumber(n: bigint): number {
  if (n == null) return 0;
  return Number(formatUnits(n, USDC_DECIMALS));
}

// ─── Market status mapping ───────────────────────────────────────────────────

function mapMarketStatus(statusInt: number): MarketStatus {
  switch (statusInt) {
    case 0:
      return "active";
    case 1:
      return "paused";
    case 2:
      return "resolved";
    case 3:
      return "cancelled";
    default:
      return "active";
  }
}

// ─── Vault reads ────────────────────────────────────────────────────────────

export async function readVaultBalance(userAddress: `0x${string}`): Promise<number> {
  const raw = await readContract(wagmiConfig, {
    address: VAULT,
    abi: vaultAbi,
    functionName: "userBalances",
    args: [userAddress]
  });
  return usdcToNumber(raw as bigint);
}

export async function readUsdcBalance(userAddress: `0x${string}`): Promise<number> {
  const raw = await readContract(wagmiConfig, {
    address: USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [userAddress]
  });
  return usdcToNumber(raw as bigint);
}

export async function readUsdcAllowance(
  owner: `0x${string}`,
  spender: `0x${string}`
): Promise<bigint> {
  return readContract(wagmiConfig, {
    address: USDC,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender]
  }) as Promise<bigint>;
}

export async function readInsuranceFund(): Promise<number> {
  const raw = await readContract(wagmiConfig, {
    address: VAULT,
    abi: vaultAbi,
    functionName: "insuranceFund"
  });
  return usdcToNumber(raw as bigint);
}

// ─── Market reads ────────────────────────────────────────────────────────────

export async function readAllMarketAddresses(): Promise<`0x${string}`[]> {
  const result = await readContract(wagmiConfig, {
    address: FACTORY,
    abi: marketFactoryAbi,
    functionName: "currentMarkets"
  });
  return (result as `0x${string}`[]).filter(
    (addr) => addr !== "0x0000000000000000000000000000000000000000"
  );
}

export async function readOrderBookAddress(
  marketAddr: `0x${string}`
): Promise<`0x${string}`> {
  return readContract(wagmiConfig, {
    address: FACTORY,
    abi: marketFactoryAbi,
    functionName: "getMarketOrderBook",
    args: [marketAddr]
  }) as Promise<`0x${string}`>;
}

interface OnChainMarketInfo {
  address: `0x${string}`;
  orderBook: `0x${string}`;
  question: string;
  imageUrl: string;
  category: string;
  resolutionTime: bigint;
  maxLeverage: bigint;
  status: number;
  yesToken: `0x${string}`;
  noToken: `0x${string}`;
  midPriceYes: bigint;
  midPriceNo: bigint;
  openInterestYes: bigint;
  openInterestNo: bigint;
  fundingRate: bigint;
  // Group market fields (undefined for standalone markets)
  groupQuestion?: string;
  outcomeGroupId?: string;
  outcomeBandLabel?: string;
  outcomeBandOrder?: number;
}

export async function readMarketInfo(
  marketAddr: `0x${string}`
): Promise<OnChainMarketInfo | null> {
  try {
    const obAddr = await readOrderBookAddress(marketAddr);

    const [config, status, yesToken, noToken, midPriceYes, midPriceNo, oiYes, oiNo, fundingState] =
      await Promise.all([
        readContract(wagmiConfig, {
          address: marketAddr,
          abi: predictionMarketAbi,
          functionName: "getConfig"
        }),
        readContract(wagmiConfig, {
          address: marketAddr,
          abi: predictionMarketAbi,
          functionName: "getStatus"
        }),
        readContract(wagmiConfig, {
          address: marketAddr,
          abi: predictionMarketAbi,
          functionName: "yesToken"
        }),
        readContract(wagmiConfig, {
          address: marketAddr,
          abi: predictionMarketAbi,
          functionName: "noToken"
        }),
        readContract(wagmiConfig, {
          address: obAddr,
          abi: orderBookAbi,
          functionName: "getMidPrice",
          args: [0] // Side.YES
        }),
        readContract(wagmiConfig, {
          address: obAddr,
          abi: orderBookAbi,
          functionName: "getMidPrice",
          args: [1] // Side.NO
        }),
        readContract(wagmiConfig, {
          address: obAddr,
          abi: orderBookAbi,
          functionName: "openInterest",
          args: [0]
        }),
        readContract(wagmiConfig, {
          address: obAddr,
          abi: orderBookAbi,
          functionName: "openInterest",
          args: [1]
        }),
        readContract(wagmiConfig, {
          address: obAddr,
          abi: orderBookAbi,
          functionName: "getFundingState"
        })
      ]);

    const cfg = config as {
      question: string;
      imageUrl: string;
      category: string;
      resolutionTime: bigint;
      creationTime: bigint;
      collateralToken: `0x${string}`;
      maxLeverage: bigint;
      maintenanceMargin: bigint;
    };

    // getFundingState returns a tuple [rate, index, lastUpdate, pool] — use
    // array destructuring (named-property access on viem tuples is unreliable).
    const [fundingRateRaw] = fundingState as readonly [bigint, bigint, bigint, bigint];

    // ── Group membership (optional enrichment) ────────────────────────────
    let groupQuestion: string | undefined;
    let groupImageUrl: string | undefined;
    let groupCategory: string | undefined;
    let outcomeGroupId: string | undefined;
    let outcomeBandLabel: string | undefined;
    let outcomeBandOrder: number | undefined;

    try {
      const rawGroupId = (await readContract(wagmiConfig, {
        address: FACTORY,
        abi: marketFactoryAbi,
        functionName: "getMarketGroupIdOf",
        args: [marketAddr]
      })) as bigint;

      const groupIdEncoded = Number(rawGroupId);
      if (groupIdEncoded > 0) {
        const actualGroupId = groupIdEncoded - 1;
        const groupData = (await readContract(wagmiConfig, {
          address: FACTORY,
          abi: marketFactoryAbi,
          functionName: "getMarketGroup",
          args: [BigInt(actualGroupId)]
        })) as readonly [string, string, string, readonly string[], readonly `0x${string}`[], bigint, boolean, bigint];
        // [question, imageUrl, category, outcomeLabels, outcomeMarkets, resolutionTime, resolved, winningOutcomeIndex]

        const [gQuestion, gImageUrl, gCategory, gLabels, gMarkets] = groupData;
        const outcomeIndex = (gMarkets as readonly string[]).findIndex(
          (addr) => addr.toLowerCase() === marketAddr.toLowerCase()
        );

        groupQuestion = gQuestion;
        outcomeGroupId = `group-${actualGroupId}`;
        outcomeBandLabel = outcomeIndex >= 0 ? (gLabels[outcomeIndex] as string) : undefined;
        outcomeBandOrder = outcomeIndex >= 0 ? outcomeIndex : undefined;
        // Group-level image/category takes precedence over the per-market config
        if (gImageUrl) groupImageUrl = gImageUrl;
        if (gCategory) groupCategory = gCategory;
      }
    } catch {
      // group info is optional — ignore errors
    }

    return {
      address: marketAddr,
      orderBook: obAddr,
      question: cfg.question,
      imageUrl: groupImageUrl ?? cfg.imageUrl ?? "",
      category: groupCategory ?? cfg.category ?? "",
      resolutionTime: cfg.resolutionTime ?? 0n,
      maxLeverage: cfg.maxLeverage ?? 0n,
      status: status as number,
      yesToken: yesToken as `0x${string}`,
      noToken: noToken as `0x${string}`,
      midPriceYes: (midPriceYes as bigint) ?? 0n,
      midPriceNo: (midPriceNo as bigint) ?? 0n,
      openInterestYes: (oiYes as bigint) ?? 0n,
      openInterestNo: (oiNo as bigint) ?? 0n,
      fundingRate: fundingRateRaw ?? 0n,
      groupQuestion,
      outcomeGroupId,
      outcomeBandLabel,
      outcomeBandOrder
    };
  } catch {
    return null;
  }
}

/** Convert on-chain market info to the frontend Market type. */
export function marketInfoToMarket(info: OnChainMarketInfo): Market {
  // getMidPrice returns 0 when there are no resting orders — default to 0.5
  const rawYesPrice = wadToNumber(info.midPriceYes);
  const yesPrice = rawYesPrice > 0 ? Math.min(1, Math.max(0, rawYesPrice)) : 0.5;
  const noPrice = Math.min(1, Math.max(0, 1 - yesPrice));
  const oiYes = usdcToNumber(info.openInterestYes);
  const oiNo = usdcToNumber(info.openInterestNo);
  const fundingRateBps = signedWadToNumber(info.fundingRate) * 10_000; // WAD/day → bps/day

  const VALID_CATEGORIES = new Set(["Trending", "Crypto", "Politics", "Sports", "Tech", "Economy", "Culture"]);

  return {
    id: info.address.toLowerCase(),
    address: info.address,
    question: info.question,
    ...(info.imageUrl ? { imageUrl: info.imageUrl } : {}),
    ...(info.groupQuestion !== undefined && { groupQuestion: info.groupQuestion }),
    ...(info.outcomeGroupId !== undefined && { outcomeGroupId: info.outcomeGroupId }),
    ...(info.outcomeBandLabel !== undefined && { outcomeBandLabel: info.outcomeBandLabel }),
    ...(info.outcomeBandOrder !== undefined && { outcomeBandOrder: info.outcomeBandOrder }),
    category: (VALID_CATEGORIES.has(info.category) ? info.category : "Crypto") as import("@/types/enums").MarketCategory,
    status: mapMarketStatus(info.status),
    oracleStatus: "pending",
    resolutionTime: new Date(Number(info.resolutionTime) * 1000).toISOString(),
    prices: { yes: yesPrice, no: noPrice },
    leverageCap: Math.round(wadToNumber(info.maxLeverage)),
    stats: {
      openInterest: oiYes + oiNo,
      fundingRateBps
    },
    lastTradedOutcome: yesPrice >= 0.5 ? "YES" : "NO"
  };
}

// ─── Orderbook reads ─────────────────────────────────────────────────────────

export async function readOrderbookDepth(
  obAddr: `0x${string}`,
  side: 0 | 1,
  maxDepth = 20
): Promise<{ bidPrices: readonly bigint[]; bidQtys: readonly bigint[]; askPrices: readonly bigint[]; askQtys: readonly bigint[] }> {
  const result = await readContract(wagmiConfig, {
    address: obAddr,
    abi: orderBookAbi,
    functionName: "getOrderBookDepth",
    args: [side, BigInt(maxDepth)]
  });
  const [bidPrices, bidQtys, askPrices, askQtys] = result as [
    readonly bigint[],
    readonly bigint[],
    readonly bigint[],
    readonly bigint[]
  ];
  return { bidPrices, bidQtys, askPrices, askQtys };
}

function buildLevels(
  prices: readonly bigint[],
  qtys: readonly bigint[]
): OrderbookLevel[] {
  let cumulative = 0;
  return prices.map((p, i) => {
    const size = usdcToNumber(qtys[i] ?? 0n);
    cumulative += size;
    return { price: wadToNumber(p), size, cumulative };
  });
}

export async function readOrderbook(marketAddr: `0x${string}`): Promise<Orderbook> {
  const obAddr = await readOrderBookAddress(marketAddr);

  const [yes, no] = await Promise.all([
    readOrderbookDepth(obAddr, 0, 20),
    readOrderbookDepth(obAddr, 1, 20)
  ]);

  const bids = buildLevels(yes.bidPrices, yes.bidQtys);
  const asks = buildLevels(yes.askPrices, yes.askQtys);

  const bestBid = bids[0]?.price ?? 0;
  const bestAsk = asks[0]?.price ?? 0;
  const spreadBps = bestBid > 0 && bestAsk > 0
    ? Math.round(((bestAsk - bestBid) / bestBid) * 10_000)
    : 0;

  return {
    marketId: marketAddr.toLowerCase(),
    bids,
    asks,
    spreadBps
  };
}

// ─── Position reads ──────────────────────────────────────────────────────────

interface RawPosition {
  id: bigint;
  trader: `0x${string}`;
  side: number;
  shares: bigint;
  entryPrice: bigint;
  margin: bigint;
  borrowed: bigint;
  leverage: bigint;
  liquidationPrice: bigint;
  entryFundingIndex: bigint;
  isOpen: boolean;
}

export async function readTraderPositions(
  obAddr: `0x${string}`,
  trader: `0x${string}`,
  marketAddr: `0x${string}`,
  marketQuestion: string
): Promise<Position[]> {
  const positionIds = (await readContract(wagmiConfig, {
    address: obAddr,
    abi: orderBookAbi,
    functionName: "getTraderPositions",
    args: [trader]
  })) as bigint[];

  if (!positionIds.length) return [];

  const posAndPnl = await readContracts(wagmiConfig, {
    contracts: positionIds.flatMap((id) => [
      {
        address: obAddr,
        abi: orderBookAbi,
        functionName: "getPosition",
        args: [id]
      } as const,
      {
        address: obAddr,
        abi: orderBookAbi,
        functionName: "getUnrealizedPnL",
        args: [id]
      } as const
    ])
  });

  const positions: Position[] = [];

  for (let i = 0; i < positionIds.length; i++) {
    const posResult = posAndPnl[i * 2]!;
    const pnlResult = posAndPnl[i * 2 + 1]!;
    if (posResult.status !== "success" || pnlResult.status !== "success") continue;

    const pos = posResult.result as RawPosition;
    if (!pos.isOpen) continue;

    const pnl = pnlResult.result as bigint;
    const outcome = pos.side === 0 ? "YES" : "NO";
    const liquidationPriceEstimate = wadToNumber(pos.liquidationPrice);

    positions.push({
      id: pos.id.toString(),
      marketId: marketAddr.toLowerCase(),
      question: marketQuestion,
      outcome,
      size: usdcToNumber(pos.shares),
      averageEntry: wadToNumber(pos.entryPrice),
      markPrice: 0, // filled in separately if needed
      leverage: wadToNumber(pos.leverage),
      collateral: usdcToNumber(pos.margin),
      liquidationPriceEstimate,
      unrealizedPnl: signedUsdcToNumber(pnl),
      settlementStatus: "open"
    });
  }

  return positions;
}

export async function readAllTraderPositions(trader: `0x${string}`): Promise<Position[]> {
  const marketAddrs = await readAllMarketAddresses();
  if (!marketAddrs.length) return [];

  // Fetch orderbook address + market config in parallel
  const marketDetails = await readContracts(wagmiConfig, {
    contracts: marketAddrs.flatMap((addr) => [
      {
        address: FACTORY,
        abi: marketFactoryAbi,
        functionName: "getMarketOrderBook",
        args: [addr]
      } as const,
      {
        address: addr,
        abi: predictionMarketAbi,
        functionName: "getConfig"
      } as const
    ])
  });

  const allPositions: Position[] = [];

  for (let i = 0; i < marketAddrs.length; i++) {
    const obResult = marketDetails[i * 2]!;
    const cfgResult = marketDetails[i * 2 + 1]!;
    if (obResult.status !== "success" || cfgResult.status !== "success") continue;

    const obAddr = obResult.result as `0x${string}`;
    const cfg = cfgResult.result as { question: string };
    const marketAddr = marketAddrs[i]!;

    const positions = await readTraderPositions(
      obAddr,
      trader,
      marketAddr,
      cfg.question
    );
    allPositions.push(...positions);
  }

  return allPositions;
}

// ─── Order reads ─────────────────────────────────────────────────────────────

interface RawOrder {
  id: bigint;
  trader: `0x${string}`;
  side: number;
  orderSide: number;
  price: bigint;
  quantity: bigint;
  filled: bigint;
  leverage: bigint;
  timestamp: bigint;
  isActive: boolean;
}

export async function readTraderOrders(
  obAddr: `0x${string}`,
  trader: `0x${string}`,
  marketAddr: `0x${string}`
): Promise<Order[]> {
  const orderIds = (await readContract(wagmiConfig, {
    address: obAddr,
    abi: orderBookAbi,
    functionName: "getTraderOrders",
    args: [trader]
  })) as bigint[];

  if (!orderIds.length) return [];

  const orderResults = await readContracts(wagmiConfig, {
    contracts: orderIds.map((id) => ({
      address: obAddr,
      abi: orderBookAbi,
      functionName: "getOrder",
      args: [id]
    } as const))
  });

  return orderResults
    .filter((r) => r.status === "success")
    .map((r) => {
      const o = r.result as RawOrder;
      const filledFraction =
        o.quantity > 0n ? Number((o.filled * 100n) / o.quantity) : 0;

      let status: Order["status"] = "open";
      if (!o.isActive && o.filled >= o.quantity) status = "filled";
      else if (!o.isActive) status = "cancelled";
      else if (o.filled > 0n) status = "partially_filled";

      const outcome = o.side === 0 ? "YES" : "NO" as const;
      const side = o.orderSide === 0 ? "BUY" : "SELL" as const;
      const quantity = usdcToNumber(o.quantity);
      const price = wadToNumber(o.price);
      const leverage = wadToNumber(o.leverage);
      const collateral = price > 0 && leverage > 0
        ? (quantity * price) / leverage
        : 0;

      return {
        id: o.id.toString(),
        marketId: marketAddr.toLowerCase(),
        outcome,
        side,
        type: "LIMIT" as const,
        price,
        size: quantity,
        collateral,
        leverage,
        feeEstimate: 0,
        status,
        createdAt: new Date(Number(o.timestamp) * 1000).toISOString()
      } satisfies Order;
    })
    .filter((o) => o.status === "open" || o.status === "partially_filled");
}

export async function readAllTraderOrders(trader: `0x${string}`): Promise<Order[]> {
  const marketAddrs = await readAllMarketAddresses();
  if (!marketAddrs.length) return [];

  const obResults = await readContracts(wagmiConfig, {
    contracts: marketAddrs.map((addr) => ({
      address: FACTORY,
      abi: marketFactoryAbi,
      functionName: "getMarketOrderBook",
      args: [addr]
    } as const))
  });

  const allOrders: Order[] = [];

  for (let i = 0; i < marketAddrs.length; i++) {
    const res = obResults[i]!;
    if (res.status !== "success") continue;
    const marketAddr = marketAddrs[i]!;
    const orders = await readTraderOrders(
      res.result as `0x${string}`,
      trader,
      marketAddr
    );
    allOrders.push(...orders);
  }

  return allOrders;
}

// ─── Share balance reads ──────────────────────────────────────────────────────

export async function readShareBalances(
  trader: `0x${string}`
): Promise<ShareBalance[]> {
  const marketAddrs = await readAllMarketAddresses();
  if (!marketAddrs.length) return [];

  const tokenResults = await readContracts(wagmiConfig, {
    contracts: marketAddrs.flatMap((addr) => [
      {
        address: addr,
        abi: predictionMarketAbi,
        functionName: "yesToken"
      } as const,
      {
        address: addr,
        abi: predictionMarketAbi,
        functionName: "noToken"
      } as const,
      {
        address: addr,
        abi: predictionMarketAbi,
        functionName: "getConfig"
      } as const
    ])
  });

  const balances: ShareBalance[] = [];

  for (let i = 0; i < marketAddrs.length; i++) {
    const yesTokenResult = tokenResults[i * 3]!;
    const noTokenResult = tokenResults[i * 3 + 1]!;
    const cfgResult = tokenResults[i * 3 + 2]!;
    if (
      yesTokenResult.status !== "success" ||
      noTokenResult.status !== "success" ||
      cfgResult.status !== "success"
    )
      continue;

    const yesToken = yesTokenResult.result as `0x${string}`;
    const noToken = noTokenResult.result as `0x${string}`;
    const cfg = cfgResult.result as { question: string };

    const [yesBal, noBal] = await Promise.all([
      readContract(wagmiConfig, {
        address: yesToken,
        abi: shareTokenAbi,
        functionName: "balanceOf",
        args: [trader]
      }) as Promise<bigint>,
      readContract(wagmiConfig, {
        address: noToken,
        abi: shareTokenAbi,
        functionName: "balanceOf",
        args: [trader]
      }) as Promise<bigint>
    ]);

    if (yesBal > 0n || noBal > 0n) {
      balances.push({
        marketId: marketAddrs[i]!.toLowerCase(),
        question: cfg.question,
        yesShares: usdcToNumber(yesBal),
        noShares: usdcToNumber(noBal)
      });
    }
  }

  return balances;
}

// ─── Portfolio summary ────────────────────────────────────────────────────────

export async function readPortfolioSummary(trader: `0x${string}`): Promise<PortfolioSummary> {
  const [vaultBalance, positions] = await Promise.all([
    readVaultBalance(trader),
    readAllTraderPositions(trader)
  ]);

  const unrealizedPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);
  const usedMargin = positions.reduce((sum, p) => sum + p.collateral, 0);

  return {
    account: trader,
    vaultBalance,
    portfolioValue: vaultBalance + usedMargin + Math.max(0, unrealizedPnl),
    unrealizedPnl,
    realizedPnl: 0, // would need event history to compute
    usedMargin,
    availableMargin: vaultBalance,
    marginRatio: usedMargin > 0 ? vaultBalance / (vaultBalance + usedMargin) : 1
  };
}

// ─── Helpers for mutations ────────────────────────────────────────────────────

/** Returns the connected wallet address, or null if not connected. */
export function getConnectedAddress(): `0x${string}` | null {
  const account = getAccount(wagmiConfig);
  return account.address ?? null;
}
