/**
 * portfolio/mutations.ts
 *
 * All write-side portfolio actions:
 *   - useCancelOrderMutation     — cancel an open order
 *   - useClosePositionMutation   — close an open position (market-sell through CLOB)
 *   - useAddMarginMutation       — add collateral to a position
 *   - useChangeLeverageMutation  — adjust leverage for an existing position
 *   - useClaimWinningsMutation   — claim winnings after market resolves YES/NO
 *   - useClaimRefundMutation     — claim full refund after market is cancelled
 *   - useMintSharesMutation      — mint YES+NO pair from vault balance
 *   - useBurnSharesMutation      — redeem YES+NO pair for USDC
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract, readContract } from "wagmi/actions";
import { parseUnits } from "viem";

import { wagmiConfig } from "@/lib/web3/config";
import { env } from "@/lib/env";
import {
  orderBookAbi,
  predictionMarketAbi,
  marketFactoryAbi
} from "@/lib/web3/abis";
import { getConnectedAddress } from "@/lib/web3/read-contracts";

const FACTORY = env.contracts.marketFactory as `0x${string}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getOrderBook(marketAddress: `0x${string}`): Promise<`0x${string}`> {
  const addr = (await readContract(wagmiConfig, {
    address: FACTORY,
    abi: marketFactoryAbi,
    functionName: "getMarketOrderBook",
    args: [marketAddress]
  })) as `0x${string}`;

  if (!addr || addr === "0x0000000000000000000000000000000000000000") {
    throw new Error("OrderBook not registered for this market");
  }
  return addr;
}

// ─── Cancel order ─────────────────────────────────────────────────────────────

interface CancelOrderPayload {
  marketAddress: `0x${string}`;
  orderId: bigint | string;
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ marketAddress, orderId }: CancelOrderPayload) => {
      const trader = getConnectedAddress();
      if (!trader) throw new Error("Wallet not connected");

      const obAddr = await getOrderBook(marketAddress);
      const id = typeof orderId === "string" ? BigInt(orderId) : orderId;

      return writeContract(wagmiConfig, {
        address: obAddr,
        abi: orderBookAbi,
        functionName: "cancelOrder",
        args: [id]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["open-orders"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
    }
  });
}

// ─── Close position ───────────────────────────────────────────────────────────

interface ClosePositionPayload {
  marketAddress: `0x${string}`;
  positionId: bigint | string;
}

export function useClosePositionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ marketAddress, positionId }: ClosePositionPayload) => {
      const trader = getConnectedAddress();
      if (!trader) throw new Error("Wallet not connected");

      const obAddr = await getOrderBook(marketAddress);
      const id = typeof positionId === "string" ? BigInt(positionId) : positionId;

      return writeContract(wagmiConfig, {
        address: obAddr,
        abi: orderBookAbi,
        functionName: "closePosition",
        args: [id]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
    }
  });
}

// ─── Add margin ───────────────────────────────────────────────────────────────

interface AddMarginPayload {
  marketAddress: `0x${string}`;
  positionId: bigint | string;
  /** Amount in human USDC (e.g. 100 = $100) */
  amountUsdc: number;
}

export function useAddMarginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ marketAddress, positionId, amountUsdc }: AddMarginPayload) => {
      const trader = getConnectedAddress();
      if (!trader) throw new Error("Wallet not connected");

      const obAddr = await getOrderBook(marketAddress);
      const id = typeof positionId === "string" ? BigInt(positionId) : positionId;
      const rawAmount = parseUnits(amountUsdc.toFixed(6), 6);

      return writeContract(wagmiConfig, {
        address: obAddr,
        abi: orderBookAbi,
        functionName: "addMargin",
        args: [id, rawAmount]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
    }
  });
}

// ─── Change leverage ──────────────────────────────────────────────────────────

/** side: 0 = YES, 1 = NO */
interface ChangeLeveragePayload {
  marketAddress: `0x${string}`;
  side: 0 | 1;
  /** New leverage in human units (e.g. 5 = 5×) */
  newLeverage: number;
}

export function useChangeLeverageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ marketAddress, side, newLeverage }: ChangeLeveragePayload) => {
      const trader = getConnectedAddress();
      if (!trader) throw new Error("Wallet not connected");

      const obAddr = await getOrderBook(marketAddress);
      const rawLev = parseUnits(newLeverage.toFixed(18), 18); // WAD

      return writeContract(wagmiConfig, {
        address: obAddr,
        abi: orderBookAbi,
        functionName: "changeLeverage",
        args: [side, rawLev]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
    }
  });
}

// ─── Claim winnings ───────────────────────────────────────────────────────────

interface ClaimWinningsPayload {
  marketAddress: `0x${string}`;
}

export function useClaimWinningsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ marketAddress }: ClaimWinningsPayload) => {
      const trader = getConnectedAddress();
      if (!trader) throw new Error("Wallet not connected");

      return writeContract(wagmiConfig, {
        address: marketAddress,
        abi: predictionMarketAbi,
        functionName: "claimWinnings"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    }
  });
}

// ─── Claim refund ─────────────────────────────────────────────────────────────

export function useClaimRefundMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ marketAddress }: ClaimWinningsPayload) => {
      const trader = getConnectedAddress();
      if (!trader) throw new Error("Wallet not connected");

      return writeContract(wagmiConfig, {
        address: marketAddress,
        abi: predictionMarketAbi,
        functionName: "claimRefund"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
    }
  });
}

// ─── Mint YES+NO share pairs ──────────────────────────────────────────────────

interface MintSharesPayload {
  marketAddress: `0x${string}`;
  /** Amount in human USDC (e.g. 100 = 100 share pairs at $1 each = $100) */
  amountUsdc: number;
}

export function useMintSharesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ marketAddress, amountUsdc }: MintSharesPayload) => {
      const trader = getConnectedAddress();
      if (!trader) throw new Error("Wallet not connected");

      const rawAmount = parseUnits(amountUsdc.toFixed(6), 6);

      return writeContract(wagmiConfig, {
        address: marketAddress,
        abi: predictionMarketAbi,
        functionName: "mintShares",
        args: [rawAmount]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
    }
  });
}

// ─── Burn YES+NO share pairs ──────────────────────────────────────────────────

export function useBurnSharesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ marketAddress, amountUsdc }: MintSharesPayload) => {
      const trader = getConnectedAddress();
      if (!trader) throw new Error("Wallet not connected");

      const rawAmount = parseUnits(amountUsdc.toFixed(6), 6);

      return writeContract(wagmiConfig, {
        address: marketAddress,
        abi: predictionMarketAbi,
        functionName: "burnShares",
        args: [rawAmount]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
    }
  });
}
