import { useCallback } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function useWalletState() {
  const account = useAccount();
  const { connect: wagmiConnect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const connect = useCallback(() => {
    const connector = connectors[0];
    if (connector) {
      wagmiConnect({ connector });
    }
  }, [wagmiConnect, connectors]);

  return {
    address: account.address,
    isConnected: account.isConnected,
    connect,
    disconnect,
    isConnecting: isPending
  };
}
