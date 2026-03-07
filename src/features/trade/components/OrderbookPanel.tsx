import type { Orderbook } from "@/types/order";

import { SectionCard } from "@/features/shared/components/SectionCard";
import { DepthTable } from "@/features/trade/components/DepthTable";

interface OrderbookPanelProps {
  orderbook: Orderbook;
}

export function OrderbookPanel({ orderbook }: OrderbookPanelProps) {
  return (
    <SectionCard title="Orderbook" subtitle={`Spread ${orderbook.spreadBps} bps`}>
      <div className="grid gap-4 lg:grid-cols-2">
        <DepthTable title="Bids" levels={orderbook.bids} />
        <DepthTable title="Asks" levels={orderbook.asks} />
      </div>
    </SectionCard>
  );
}
