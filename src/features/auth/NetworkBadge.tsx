import { useAccount } from "wagmi";

import { Badge } from "@/components/ui/badge";
import { getChainShort, isSupportedChain } from "@/lib/web3/chains";

export function NetworkBadge() {
  const account = useAccount();

  if (!account.isConnected) {
    return <Badge variant="default">Disconnected</Badge>;
  }

  if (!account.chainId) {
    return <Badge variant="risk">No Network</Badge>;
  }

  if (!isSupportedChain(account.chainId)) {
    return <Badge variant="risk">Unsupported Chain</Badge>;
  }

  const chainShort = getChainShort(account.chainId);
  const isEthereumChain = account.chainId === 1 || chainShort.toLowerCase() === "ethereum";

  if (isEthereumChain) {
    return (
      <Badge
        variant="neutral"
        className="border-[#00f6ff]/40 bg-black/70 text-[#9dfdff] shadow-[0_0_0_1px_rgba(0,246,255,0.2),0_0_16px_rgba(0,246,255,0.2)]"
      >
        <span className="flex items-center gap-1">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[#00f6ff] shadow-[0_0_8px_rgba(0,246,255,0.85)]"
          />
          {chainShort}
        </span>
      </Badge>
    );
  }

  return <Badge variant="neutral">{chainShort}</Badge>;
}
