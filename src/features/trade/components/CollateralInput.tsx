import { Input } from "@/components/ui/input";

interface CollateralInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function CollateralInput({ value, onChange }: CollateralInputProps) {
  return (
    <label className="space-y-2 text-xs uppercase tracking-[0.14em] text-muted">
      Collateral (USDC)
      <Input
        type="number"
        min={0}
        step="0.01"
        value={Number.isNaN(value) ? "" : value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
