import { SectionCard } from "@/features/shared/components/SectionCard";
import { resolutionHeadline } from "@/features/resolution/adapters";
import type { ResolutionState } from "@/types/resolution";

interface ResolutionStatusCardProps {
  state: ResolutionState;
}

export function ResolutionStatusCard({ state }: ResolutionStatusCardProps) {
  return (
    <SectionCard title="Resolution" subtitle={resolutionHeadline(state)}>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-line p-2">
          <p className="uppercase tracking-[0.14em] text-muted">Market</p>
          <p className="mt-1 uppercase">{state.marketStatus}</p>
        </div>
        <div className="rounded-xl border border-line p-2">
          <p className="uppercase tracking-[0.14em] text-muted">Oracle</p>
          <p className="mt-1 uppercase">{state.oracleStatus}</p>
        </div>
      </div>
    </SectionCard>
  );
}
