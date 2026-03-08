import { createConfig, http } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { defineChain, type Chain } from "viem";
import { arbitrum, base, mainnet, sepolia } from "viem/chains";

import { env } from "@/lib/env";

const knownChainMap: Record<number, Chain> = {
  1: mainnet,
  8453: base,
  42161: arbitrum,
  11155111: sepolia
};

function makeChain(chainId: number): Chain {
  const known = knownChainMap[chainId];
  const rpc = env.rpcUrls[chainId] ?? env.rpcUrl;
  const explorer = env.explorerUrls[chainId] ?? env.explorerUrl;

  if (known) {
    const baseExplorer = known.blockExplorers?.default ?? {
      name: "Explorer",
      url: explorer
    };

    return {
      ...known,
      rpcUrls: {
        default: { http: [rpc] },
        public: { http: [rpc] }
      },
      blockExplorers: {
        ...known.blockExplorers,
        default: {
          ...baseExplorer,
          url: explorer
        }
      }
    };
  }

  return defineChain({
    id: chainId,
    name: `Hubris Chain ${chainId}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpcUrls: {
      default: { http: [rpc] },
      public: { http: [rpc] }
    },
    blockExplorers: {
      default: {
        name: "Explorer",
        url: explorer
      }
    }
  });
}

const configuredChainIds = env.availableChains.length > 0 ? env.availableChains : [env.chainId];
const chains = configuredChainIds.map(makeChain);
const activeChain = chains.find((item) => item.id === env.chainId) ?? makeChain(env.chainId);

const transports = Object.fromEntries(
  chains.map((item) => [item.id, http(env.rpcUrls[item.id] ?? env.rpcUrl)])
);

export const wagmiConfig = createConfig({
  chains: chains as [Chain, ...Chain[]],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: "Hubris" }),
    ...(env.walletConnectProjectId
      ? [walletConnect({ projectId: env.walletConnectProjectId })]
      : [])
  ],
  transports,
  ssr: false
});

export { activeChain as chain, chains };
