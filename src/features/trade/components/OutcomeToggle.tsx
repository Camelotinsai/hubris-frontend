import type { OutcomeSide } from "@/types/enums";

import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

interface OutcomeToggleProps {
  value: OutcomeSide;
  onChange: (value: OutcomeSide) => void;
}

export function OutcomeToggle({ value, onChange }: OutcomeToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Outcome side">
      {(["YES", "NO"] as const).map((side) => (
        <button
          key={side}
          type="button"
          role="radio"
          aria-checked={value === side}
          className={cn(
            "h-11 rounded-xl border text-xs font-semibold uppercase tracking-[0.14em] transition",
            value === side
              ? side === "YES"
                ? "border-line-strong bg-positive/10 text-positive shadow-[inset_0_0_0_1px_rgba(0,255,136,0.55)]"
                : "border-line-strong bg-risk/10 text-risk shadow-[inset_0_0_0_1px_rgba(255,51,68,0.55)]"
              : side === "NO"
                ? "border-line-strong text-muted hover:border-risk/70 hover:bg-risk/10 hover:text-risk"
                : "border-line-strong text-muted hover:border-positive/70 hover:bg-positive/10 hover:text-positive"
          )}
          onClick={() => {
            onChange(side);
            track("outcome_toggle", { side });
          }}
        >
          {side}
        </button>
      ))}
    </div>
  );
}
