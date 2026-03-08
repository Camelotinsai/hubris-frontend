import { useState } from "react";

import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { useWallet } from "@/hooks/use-wallet";
import { WalletSelectorDialog } from "@/features/auth/WalletSelectorDialog";

export function WalletConnectButton() {
  const wallet = useWallet();
  const [open, setOpen] = useState(false);

  if (wallet.isConnected) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          track("wallet_disconnect_click", {});
          wallet.disconnect();
        }}
      >
        {wallet.shortAddress}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          track("wallet_connect_click", { source: "topbar" });
          setOpen(true);
        }}
        disabled={wallet.isConnecting}
      >
        {wallet.isConnecting ? "Connecting" : "Connect Wallet"}
      </Button>
      <WalletSelectorDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
