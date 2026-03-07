import type { Position } from "@/types/position";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber, formatUsd } from "@/lib/format";

interface PositionsTableProps {
  rows: Position[];
  humanOnlyByMarketId: ReadonlyMap<string, boolean>;
}

export function PositionsTable({ rows, humanOnlyByMarketId }: PositionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Market</TableHead>
          <TableHead>Outcome</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Leverage</TableHead>
          <TableHead>PnL</TableHead>
          <TableHead>Liq Est.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((position) => (
          <TableRow key={position.id}>
            <TableCell>
              <div className="flex flex-wrap items-center gap-2">
                <span>{position.question}</span>
                {humanOnlyByMarketId.get(position.marketId) ? <Badge variant="neutral">Human Only</Badge> : null}
              </div>
            </TableCell>
            <TableCell>{position.outcome}</TableCell>
            <TableCell>{formatNumber(position.size, 0)}</TableCell>
            <TableCell>{formatNumber(position.leverage, 1)}x</TableCell>
            <TableCell className={position.unrealizedPnl >= 0 ? "text-positive" : "text-risk"}>
              {formatUsd(position.unrealizedPnl)}
            </TableCell>
            <TableCell>{formatNumber(position.liquidationPriceEstimate * 100, 2)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
