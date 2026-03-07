import type { MarketStatus } from "@/types/enums";

import { StatusPill } from "@/features/shared/components/StatusPill";

interface MarketStatusPillProps {
  status: MarketStatus;
}

export function MarketStatusPill({ status }: MarketStatusPillProps) {
  return <StatusPill status={status} />;
}
