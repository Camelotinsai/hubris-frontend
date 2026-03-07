import type { MarketStatus } from "@/types/enums";

import { Badge } from "@/components/ui/badge";

interface StatusPillProps {
  status: MarketStatus;
}

export function StatusPill({ status }: StatusPillProps) {
  const variant =
    status === "active" ? "positive" : status === "paused" || status === "cancelled" ? "risk" : "neutral";

  return <Badge variant={variant}>{status}</Badge>;
}
