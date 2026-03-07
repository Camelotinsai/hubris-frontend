import type { Order } from "@/types/order";

import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/dates";
import { formatNumber } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderHistoryTableProps {
  rows: Order[];
  humanOnlyByMarketId: ReadonlyMap<string, boolean>;
}

export function OrderHistoryTable({ rows, humanOnlyByMarketId }: OrderHistoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Market</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Side</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>
              <div className="flex flex-wrap items-center gap-2">
                <span>{order.marketId}</span>
                {humanOnlyByMarketId.get(order.marketId) ? <Badge variant="neutral">Human Only</Badge> : null}
              </div>
            </TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.type}</TableCell>
            <TableCell>{order.side}</TableCell>
            <TableCell>{formatNumber(order.size, 0)}</TableCell>
            <TableCell>{formatDateTime(order.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
