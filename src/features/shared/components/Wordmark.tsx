import { cn } from "@/lib/cn";

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={cn("flex flex-col", className)}>
      <span className="text-sm font-semibold tracking-[0.14em] text-text">HUBRIS</span>
      <span className="hidden text-[10px] uppercase tracking-[0.16em] text-muted sm:inline">
        Leveraged Conviction
      </span>
    </span>
  );
}
