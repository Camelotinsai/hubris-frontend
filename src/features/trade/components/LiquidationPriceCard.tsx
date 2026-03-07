import { formatNumber } from "@/lib/format";

interface LiquidationPriceCardProps {
  value: number;
}

export function LiquidationPriceCard({ value }: LiquidationPriceCardProps) {
  return (
    <div className="rounded-xl border border-risk/50 bg-panel2 p-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Estimated Liquidation</p>
      <p className="mt-1 text-lg font-semibold text-risk">{formatNumber(value * 100, 2)}%</p>
      <p className="mt-1 text-xs text-muted">Estimate only. Final margin checks are authoritative on-chain.</p>
    </div>
  );
}
