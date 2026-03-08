/**
 * use-vault.ts
 *
 * Hook for reading Vault balances and executing Vault transactions:
 *   - readVaultBalance: user's USDC in the Vault
 *   - readUsdcWalletBalance: user's USDC in their wallet
 *   - useDeposit: approve USDC → userDeposit (two-step)
 *   - useWithdraw: userWithdraw
 *   - useDepositInsurance / useWithdrawInsurance
 */

import { useCallback } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { useQueryClient } from "@tanstack/react-query";

import { env } from "@/lib/env";
import { vaultAbi, erc20Abi } from "@/lib/web3/abis";

const VAULT = env.contracts.vault as `0x${string}`;
const USDC = env.contracts.usdc as `0x${string}`;
const USDC_DECIMALS = 6;

// ─── Balance reads ───────────────────────────────────────────────────────────

export function useVaultBalance() {
  const { address } = useAccount();

  return useReadContract({
    address: VAULT,
    abi: vaultAbi,
    functionName: "userBalances",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 8_000,
      select: (raw) => Number(raw) / 1e6
    }
  });
}

export function useWalletUsdcBalance() {
  const { address } = useAccount();

  return useReadContract({
    address: USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 8_000,
      select: (raw) => Number(raw) / 1e6
    }
  });
}

export function useInsuranceFund() {
  return useReadContract({
    address: VAULT,
    abi: vaultAbi,
    functionName: "insuranceFund",
    query: {
      refetchInterval: 30_000,
      select: (raw) => Number(raw) / 1e6
    }
  });
}

export function useMyInsuranceDeposit() {
  const { address } = useAccount();

  return useReadContract({
    address: VAULT,
    abi: vaultAbi,
    functionName: "insuranceDeposits",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 30_000,
      select: (raw) => Number(raw) / 1e6
    }
  });
}

// ─── Deposit (approve + userDeposit) ─────────────────────────────────────────

export interface DepositResult {
  approveTxHash?: `0x${string}`;
  depositTxHash?: `0x${string}`;
}

/**
 * Two-step deposit: approve USDC to Vault, then call userDeposit.
 * Returns a `deposit(amountUsdc: number)` callback.
 */
export function useVaultDeposit() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const deposit = useCallback(
    async (amountUsdc: number): Promise<DepositResult> => {
      if (!address) throw new Error("Wallet not connected");

      const rawAmount = parseUnits(amountUsdc.toFixed(6), USDC_DECIMALS);

      // 1. Check existing allowance
      // (we just always approve for simplicity — idempotent & safe)
      const approveTxHash = await writeContractAsync({
        address: USDC,
        abi: erc20Abi,
        functionName: "approve",
        args: [VAULT, rawAmount]
      });

      // 2. Deposit
      const depositTxHash = await writeContractAsync({
        address: VAULT,
        abi: vaultAbi,
        functionName: "userDeposit",
        args: [rawAmount]
      });

      // Invalidate balance caches
      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });

      return { approveTxHash, depositTxHash };
    },
    [address, writeContractAsync, queryClient]
  );

  return { deposit };
}

// ─── Withdraw ─────────────────────────────────────────────────────────────────

export function useVaultWithdraw() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const withdraw = useCallback(
    async (amountUsdc: number): Promise<`0x${string}`> => {
      if (!address) throw new Error("Wallet not connected");

      const rawAmount = parseUnits(amountUsdc.toFixed(6), USDC_DECIMALS);

      const txHash = await writeContractAsync({
        address: VAULT,
        abi: vaultAbi,
        functionName: "userWithdraw",
        args: [rawAmount]
      });

      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
      return txHash;
    },
    [address, writeContractAsync, queryClient]
  );

  return { withdraw };
}

// ─── Insurance fund ───────────────────────────────────────────────────────────

export function useDepositInsurance() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const depositInsurance = useCallback(
    async (amountUsdc: number): Promise<DepositResult> => {
      if (!address) throw new Error("Wallet not connected");

      const rawAmount = parseUnits(amountUsdc.toFixed(6), USDC_DECIMALS);

      const approveTxHash = await writeContractAsync({
        address: USDC,
        abi: erc20Abi,
        functionName: "approve",
        args: [VAULT, rawAmount]
      });

      const depositTxHash = await writeContractAsync({
        address: VAULT,
        abi: vaultAbi,
        functionName: "depositInsurance",
        args: [rawAmount]
      });

      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
      return { approveTxHash, depositTxHash };
    },
    [address, writeContractAsync, queryClient]
  );

  return { depositInsurance };
}

export function useWithdrawInsurance() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const withdrawInsurance = useCallback(
    async (amountUsdc: number): Promise<`0x${string}`> => {
      if (!address) throw new Error("Wallet not connected");

      const rawAmount = parseUnits(amountUsdc.toFixed(6), USDC_DECIMALS);

      const txHash = await writeContractAsync({
        address: VAULT,
        abi: vaultAbi,
        functionName: "withdrawInsurance",
        args: [rawAmount]
      });

      queryClient.invalidateQueries({ queryKey: ["portfolio-summary"] });
      return txHash;
    },
    [address, writeContractAsync, queryClient]
  );

  return { withdrawInsurance };
}

// ─── Convenience bundle ───────────────────────────────────────────────────────

/** All vault data + actions in one import */
export function useVault() {
  const vaultBalance = useVaultBalance();
  const walletBalance = useWalletUsdcBalance();
  const { deposit } = useVaultDeposit();
  const { withdraw } = useVaultWithdraw();

  return {
    /** On-chain vault balance in USDC (null while loading) */
    vaultBalance: vaultBalance.data ?? null,
    vaultBalanceLoading: vaultBalance.isLoading,
    /** Wallet USDC balance (null while loading) */
    walletBalance: walletBalance.data ?? null,
    walletBalanceLoading: walletBalance.isLoading,
    /** Deposit USDC into vault (approve + deposit) */
    deposit,
    /** Withdraw USDC from vault */
    withdraw,
    /** True when either balance is still fetching */
    isLoading: vaultBalance.isLoading || walletBalance.isLoading
  };
}
