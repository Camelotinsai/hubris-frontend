/**
 * trade/mutations.ts
 *
 * useSubmitTradeMutation — places a limit or market order on-chain.
 *
 * BUY flow  (limit or market):
 *   orderBook.placeLimitOrder / placeMarketOrder
 *   (margin is deducted from the user's Vault balance automatically)
 *
 * SELL flow (limit or market):
 *   1. shareToken.approve(orderBookAddr, quantity)  — if allowance is insufficient
 *   2. orderBook.placeLimitOrder / placeMarketOrder
 *
 * Unit conversions:
 *   price    → WAD  (1e18)
 *   quantity → USDC 6-decimal
 *   leverage → WAD  (1e18)
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { writeContract, readContract } from "wagmi/actions";
import { parseUnits } from "viem";

import { wagmiConfig } from "@/lib/web3/config";
import { env } from "@/lib/env";
import { orderBookAbi, shareTokenAbi, predictionMarketAbi, marketFactoryAbi } from "@/lib/web3/abis";
import { getConnectedAddress } from "@/lib/web3/read-contracts";
import type { TradeTicketState } from "@/state/atoms/trade";

const FACTORY = env.contracts.marketFactory as `0x${string}`;

// Enum values matching the Solidity contract
const Side = { YES: 0, NO: 1 } as const;
const OrderSide = { Buy: 0, Sell: 1 } as const;

interface SubmitTradePayload {
  /** The on-chain market contract address (hex) */
  marketAddress: `0x${string}`;
  ticket: TradeTicketState;
}

interface SubmitTradeResult {
  txHash: `0x${string}`;
  orderId?: bigint;
}

async function submitTrade(payload: SubmitTradePayload): Promise<SubmitTradeResult> {
  const { marketAddress, ticket } = payload;

  const trader = getConnectedAddress();
  if (!trader) throw new Error("Wallet not connected");

  // 1. Resolve the OrderBook address for this market
  const obAddr = (await readContract(wagmiConfig, {
    address: FACTORY,
    abi: marketFactoryAbi,
    functionName: "getMarketOrderBook",
    args: [marketAddress]
  })) as `0x${string}`;

  if (!obAddr || obAddr === "0x0000000000000000000000000000000000000000") {
    throw new Error("OrderBook not registered for this market");
  }

  const side = ticket.outcome === "YES" ? Side.YES : Side.NO;
  const orderSide = ticket.side === "BUY" ? OrderSide.Buy : OrderSide.Sell;

  // WAD / USDC6 unit conversions
  const price = parseUnits(ticket.limitPrice.toFixed(18), 18);          // WAD
  const quantity = parseUnits(ticket.quantity.toFixed(6), 6);            // 6-dec shares
  const leverage = parseUnits(ticket.leverage.toFixed(18), 18);          // WAD

  // 2. For SELL orders: ensure the share token is approved to the OrderBook
  if (ticket.side === "SELL") {
    const tokenAddress = (await readContract(wagmiConfig, {
      address: marketAddress,
      abi: predictionMarketAbi,
      functionName: ticket.outcome === "YES" ? "yesToken" : "noToken"
    })) as `0x${string}`;

    const allowance = (await readContract(wagmiConfig, {
      address: tokenAddress,
      abi: shareTokenAbi,
      functionName: "allowance",
      args: [trader, obAddr]
    })) as bigint;

    if (allowance < quantity) {
      await writeContract(wagmiConfig, {
        address: tokenAddress,
        abi: shareTokenAbi,
        functionName: "approve",
        args: [obAddr, quantity]
      });
    }
  }

  // 3. Place the order
  if (ticket.type === "LIMIT") {
    const txHash = await writeContract(wagmiConfig, {
      address: obAddr,
      abi: orderBookAbi,
      functionName: "placeLimitOrder",
      args: [side, orderSide, price, quantity, leverage]
    });
    return { txHash };
  } else {
    // MARKET order
    const txHash = await writeContract(wagmiConfig, {
      address: obAddr,
      abi: orderBookAbi,
      functionName: "placeMarketOrder",
      args: [side, orderSide, quantity, leverage]
    });
    return { txHash };
  }
}

export function useSubmitTradeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["open-orders"] });
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
    }
  });
}
