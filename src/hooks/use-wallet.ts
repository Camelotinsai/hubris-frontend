import { useMemo } from "react";

import { useWalletState } from "@/lib/web3/wallet";

export function useWallet() {
  const wallet = useWalletState();

  // Use stable primitives as deps — wallet object reference changes every render
  // because useWalletState returns a new object literal each time.
  return useMemo(
    () => ({
      ...wallet,
      shortAddress: wallet.address
        ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(wallet.address.length - 4)}`
        : "Disconnected"
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wallet.address, wallet.isConnected, wallet.isConnecting, wallet.connect, wallet.disconnect]
  );
}
