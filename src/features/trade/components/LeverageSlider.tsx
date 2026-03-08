import { Slider } from "@/components/ui/slider";
import { track } from "@/lib/analytics";

interface LeverageSliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export function LeverageSlider({ value, max, onChange }: LeverageSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted">
        <span>Leverage</span>
        <span>{value.toFixed(1)}x</span>
      </div>
      <Slider
        min={1}
        max={max}
        step={0.5}
        defaultValue={[value]}
        onValueCommit={(values) => {
          const next = values[0] ?? 1;
          if (next === value) {
            return;
          }
          onChange(next);
          track("leverage_change", { leverage: next });
        }}
      />
      <div className="flex justify-between text-[11px] text-muted">
        <span>1x</span>
        <span>{max}x cap</span>
      </div>
    </div>
  );
}
