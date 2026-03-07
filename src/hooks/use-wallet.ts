import { useMemo } from "react";

import { useWalletState } from "@/lib/web3/wallet";

export function useWallet() {
  const wallet = useWalletState();

  return useMemo(
    () => ({
      ...wallet,
      shortAddress: wallet.address
        ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(wallet.address.length - 4)}`
        : "Disconnected"
    }),
    [wallet]
  );
}
