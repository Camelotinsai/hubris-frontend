import { useState } from "react";
import type { PortfolioSummary } from "@/types/portfolio";

import { SectionCard } from "@/features/shared/components/SectionCard";
import { Button } from "@/components/ui/button";
import { formatUsd } from "@/lib/format";
import { useVault } from "@/hooks/use-vault";

interface VaultBalanceCardProps {
  summary: PortfolioSummary;
}

export function VaultBalanceCard({ summary }: VaultBalanceCardProps) {
  const vault = useVault();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"deposit" | "withdraw" | null>(null);
  const [isPending, setIsPending] = useState(false);

  const displayBalance = vault.vaultBalance !== null ? vault.vaultBalance : summary.vaultBalance;

  const handleAction = async () => {
    const amount = parseFloat(input);
    if (isNaN(amount) || amount <= 0) return;
    setIsPending(true);
    try {
      if (mode === "deposit") await vault.deposit(amount);
      else if (mode === "withdraw") await vault.withdraw(amount);
      setInput("");
      setMode(null);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <SectionCard title="Vault Balance" subtitle="USDC collateral available">
      <p className="kpi-number text-2xl font-semibold">{formatUsd(displayBalance)}</p>

      {vault.walletBalance !== null && (
        <p className="mt-1 text-xs text-muted">Wallet: {formatUsd(vault.walletBalance)} USDC</p>
      )}

      {mode ? (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount USDC"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-32 rounded-md border border-line bg-transparent px-2 py-1 text-sm focus:outline-none"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={handleAction}
          >
            {isPending ? "Pending…" : mode === "deposit" ? "Deposit" : "Withdraw"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => { setMode(null); setInput(""); }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => setMode("deposit")}>
            Deposit
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={() => setMode("withdraw")}>
            Withdraw
          </Button>
        </div>
      )}
    </SectionCard>
  );
}
