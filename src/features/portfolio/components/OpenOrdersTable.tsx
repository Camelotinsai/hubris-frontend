import type { Order } from "@/types/order";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/dates";
import { formatNumber } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCancelOrderMutation } from "@/features/portfolio/mutations";

interface OpenOrdersTableProps {
  rows: Order[];
  humanOnlyByMarketId: ReadonlyMap<string, boolean>;
}

export function OpenOrdersTable({ rows, humanOnlyByMarketId }: OpenOrdersTableProps) {
  const cancelOrder = useCancelOrderMutation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Market</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Side</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Created</TableHead>
          <TableHead />
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
            <TableCell>{order.type}</TableCell>
            <TableCell>{order.side}</TableCell>
            <TableCell>{order.price ? `${formatNumber(order.price * 100, 2)}%` : "MKT"}</TableCell>
            <TableCell>{formatDateTime(order.createdAt)}</TableCell>
            <TableCell>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={cancelOrder.isPending}
                onClick={() =>
                  cancelOrder.mutate({
                    marketAddress: order.marketId as `0x${string}`,
                    orderId: order.id
                  })
                }
              >
                Cancel
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
