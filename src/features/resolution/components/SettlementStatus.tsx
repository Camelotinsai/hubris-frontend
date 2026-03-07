import type { SettlementStatus as SettlementStatusType } from "@/types/enums";

import { Badge } from "@/components/ui/badge";

interface SettlementStatusProps {
  status: SettlementStatusType;
}

export function SettlementStatus({ status }: SettlementStatusProps) {
  const variant = status === "settled" ? "positive" : status === "awaiting_settlement" ? "neutral" : "default";
  return <Badge variant={variant}>{status}</Badge>;
}
