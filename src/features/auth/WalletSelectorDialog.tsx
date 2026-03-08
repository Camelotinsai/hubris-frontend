import { useConnect, useConnectors, type Connector } from "wagmi";
import { Loader2, AlertCircle, Wallet } from "lucide-react";

import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

// ─── Per-connector icon ───────────────────────────────────────────────────────

const BRAND_COLORS: Record<string, string> = {
  metamask: "#F6851B",
  coinbase: "#0052FF",
  walletconnect: "#3B99FC",
  phantom: "#AB9FF2",
  brave: "#FB542B",
  rainbow: "#174299",
  trust: "#3375BB",
  uniswap: "#FF007A",
  frame: "#1A1A1A",
  rabby: "#7B61FF",
  zerion: "#2962EF"
};

function connectorColor(connector: Connector): string {
  const key = connector.name.toLowerCase();
  return (
    Object.entries(BRAND_COLORS).find(([k]) => key.includes(k))?.[1] ?? "#6b7280"
  );
}

function connectorDescription(connector: Connector): string {
  if (connector.type === "walletConnect") return "Scan with any mobile wallet";
  if (connector.type === "coinbaseWallet") return "Coinbase app or extension";
  if (connector.type === "injected") return "Browser extension";
  return "Connect";
}

function ConnectorIcon({ connector }: { connector: Connector }) {
  if (connector.icon) {
    return (
      <img
        src={connector.icon}
        alt=""
        className="h-10 w-10 rounded-xl object-contain"
      />
    );
  }

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white"
      style={{ backgroundColor: connectorColor(connector) }}
    >
      {connector.name.charAt(0).toUpperCase()}
    </div>
  );
}

// ─── Dialog ───────────────────────────────────────────────────────────────────

interface WalletSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletSelectorDialog({ open, onOpenChange }: WalletSelectorDialogProps) {
  const connectors = useConnectors();
  const { connect, isPending, error, variables } = useConnect();

  const handleConnect = (connector: Connector) => {
    connect(
      { connector },
      {
        onSuccess: () => {
          track("wallet_connected", { connector: connector.name });
          onOpenChange(false);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>Choose a wallet provider to connect.</DialogDescription>
        </DialogHeader>

        <div className="mt-2 space-y-2">
          {connectors.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Wallet className="h-8 w-8 text-muted opacity-40" />
              <p className="text-sm text-muted">
                No wallet detected.
                <br />
                Install MetaMask or another browser wallet to continue.
              </p>
            </div>
          ) : (
            connectors.map((connector) => {
              const isConnecting =
                isPending && variables?.connector === connector;

              return (
                <button
                  key={connector.uid}
                  type="button"
                  onClick={() => handleConnect(connector)}
                  disabled={isPending}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border border-line bg-panel2 px-4 py-3 text-left",
                    "transition-colors hover:border-line-strong hover:bg-panel",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-line-strong",
                    "disabled:cursor-not-allowed disabled:opacity-60"
                  )}
                >
                  <ConnectorIcon connector={connector} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{connector.name}</p>
                    <p className="text-xs text-muted">
                      {connectorDescription(connector)}
                    </p>
                  </div>
                  {isConnecting && (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-risk/30 bg-risk/10 px-4 py-3 text-sm text-risk">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{(error as { shortMessage?: string }).shortMessage ?? error.message}</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
