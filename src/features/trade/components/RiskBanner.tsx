import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/cn";

interface RiskBannerProps {
  riskLevel: "normal" | "high";
  leverage: number;
}

export function RiskBanner({ riskLevel, leverage }: RiskBannerProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3 text-xs",
        riskLevel === "high" ? "border-risk text-risk" : "border-line text-muted"
      )}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
        <AlertTriangle className="h-4 w-4" />
        Threshold Risk
      </div>
      <p className="mt-1 leading-relaxed">
        {riskLevel === "high"
          ? `Leverage is ${leverage.toFixed(1)}x. Margin decay is steep near threshold.`
          : "The higher you fly, the thinner the margin."}
      </p>
    </div>
  );
}
