import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const DEMO_WALLET_ADDRESS = "0x7E57DeaD00000000000000000000000000a11ce";
const DEMO_WALLET_KEY = "hubris_demo_wallet_connected";

export function useWalletState() {
    const demoWalletMode = import.meta.env.VITE_DEMO_WALLET === "true";
    const account = useAccount();
    const { connect: wagmiConnect, connectors, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const [demoConnected, setDemoConnected] = useState(false);

    useEffect(() => {
        if (!demoWalletMode || typeof window === "undefined") return;
        setDemoConnected(window.localStorage.getItem(DEMO_WALLET_KEY) === "1");
    }, [demoWalletMode]);

    const setDemoConnection = (next: boolean) => {
        setDemoConnected(next);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(DEMO_WALLET_KEY, next ? "1" : "0");
        }
    };

    const demoWalletState = useMemo(
        () => ({
            address: demoConnected
                ? (DEMO_WALLET_ADDRESS as `0x${string}`)
                : undefined,
            isConnected: demoConnected,
            connect: () => setDemoConnection(true),
            disconnect: () => setDemoConnection(false),
            isConnecting: false,
        }),
        [demoConnected],
    );

    const connect = useCallback(() => {
        const connector = connectors[0];
        if (connector) {
            wagmiConnect({ connector });
        }
    }, [wagmiConnect, connectors]);

    if (demoWalletMode) {
        return demoWalletState;
    }

    return {
        address: account.address,
        isConnected: account.isConnected,
        connect,
        disconnect,
        isConnecting: isPending,
    };
}
