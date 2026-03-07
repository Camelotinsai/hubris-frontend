import type { ShareBalance } from "@/types/position";

import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ShareBalancesTableProps {
  rows: ShareBalance[];
  humanOnlyByMarketId: ReadonlyMap<string, boolean>;
}

export function ShareBalancesTable({ rows, humanOnlyByMarketId }: ShareBalancesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Market</TableHead>
          <TableHead>YES Shares</TableHead>
          <TableHead>NO Shares</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((balance) => (
          <TableRow key={balance.marketId}>
            <TableCell>
              <div className="flex flex-wrap items-center gap-2">
                <span>{balance.question}</span>
                {humanOnlyByMarketId.get(balance.marketId) ? <Badge variant="neutral">Human Only</Badge> : null}
              </div>
            </TableCell>
            <TableCell>{formatNumber(balance.yesShares, 0)}</TableCell>
            <TableCell>{formatNumber(balance.noShares, 0)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
