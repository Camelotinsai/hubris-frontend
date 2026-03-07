import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { useWallet } from "@/hooks/use-wallet";

const CONNECTIVITY_BADGES = ["Sepolia"] as const;

export function DisconnectedStatusBanner() {
  const wallet = useWallet();

  if (wallet.isConnected) {
    return null;
  }

  return (
    <section
      className="threshold-line mb-4 rounded-2xl border border-line-strong bg-panel/80 p-4 shadow-threshold"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Not Connected</p>
          <h2 className="text-sm">Read-only mode active. Connect to place orders.</h2>
          <p className="text-xs text-muted">
            Wallet connection is required for trade submission, collateral approvals, and portfolio synchronization.
          </p>
          <div className="flex flex-wrap gap-2">
            {CONNECTIVITY_BADGES.map((name) => (
              <Badge key={name} variant="default">
                {name}
              </Badge>
            ))}
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            track("wallet_connect_click", { source: "disconnected_banner" });
            wallet.connect();
          }}
          disabled={wallet.isConnecting}
          className="min-w-40"
        >
          {wallet.isConnecting ? "Connecting" : "Connect Wallet"}
        </Button>
      </div>
    </section>
  );
}
