import { env } from "@/lib/env";

interface ChainMeta {
  name: string;
  short: string;
}

const CHAIN_META: Record<number, ChainMeta> = {
  1: { name: "Ethereum Mainnet", short: "Ethereum" },
  8453: { name: "Base Mainnet", short: "Base" },
  42161: { name: "Arbitrum One", short: "Arbitrum" },
  11155111: { name: "Sepolia", short: "Sepolia" }
};

export function getChainMeta(chainId: number): ChainMeta {
  return CHAIN_META[chainId] ?? { name: `Chain ${chainId}`, short: `Chain ${chainId}` };
}

export function getChainName(chainId: number): string {
  return getChainMeta(chainId).name;
}

export function getChainShort(chainId: number): string {
  return getChainMeta(chainId).short;
}

export function getSupportedChainIds(): number[] {
  return env.availableChains;
}

export function isSupportedChain(chainId: number): boolean {
  return getSupportedChainIds().includes(chainId);
}
