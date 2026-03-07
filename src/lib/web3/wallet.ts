import { useAccount, useConnect, useDisconnect } from "wagmi";

export function useWalletState() {
  const account = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  return {
    address: account.address,
    isConnected: account.isConnected,
    connect: () => {
      const connector = connectors[0];
      if (connector) {
        connect({ connector });
      }
    },
    disconnect,
    isConnecting: isPending
  };
}
