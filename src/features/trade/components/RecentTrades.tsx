import type { TradePrint } from "@/types/order";

import { formatDateTime } from "@/lib/dates";
import { formatNumber } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionCard } from "@/features/shared/components/SectionCard";

interface RecentTradesProps {
  trades: TradePrint[];
}

export function RecentTrades({ trades }: RecentTradesProps) {
  return (
    <SectionCard title="Recent Trades" subtitle="Latest prints">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted">
                No prints recorded for this market
              </TableCell>
            </TableRow>
          ) : (
            trades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{formatDateTime(trade.timestamp)}</TableCell>
                <TableCell>{trade.side}</TableCell>
                <TableCell>{trade.outcome}</TableCell>
                <TableCell>{formatNumber(trade.price * 100, 2)}%</TableCell>
                <TableCell>{formatNumber(trade.size, 0)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
