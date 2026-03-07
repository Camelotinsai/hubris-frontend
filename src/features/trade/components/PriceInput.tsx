import { Input } from "@/components/ui/input";

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function PriceInput({ value, onChange, disabled }: PriceInputProps) {
  return (
    <label className="space-y-2 text-xs uppercase tracking-[0.14em] text-muted">
      Limit Price
      <Input
        type="number"
        min={0.01}
        max={0.99}
        step="0.001"
        value={Number.isNaN(value) ? "" : value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
      />
    </label>
  );
}
