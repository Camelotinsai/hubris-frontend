import type { ShareBalance } from "@/types/position";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useClaimWinningsMutation, useClaimRefundMutation } from "@/features/portfolio/mutations";

interface ShareBalancesTableProps {
  rows: ShareBalance[];
  humanOnlyByMarketId: ReadonlyMap<string, boolean>;
}

export function ShareBalancesTable({ rows, humanOnlyByMarketId }: ShareBalancesTableProps) {
  const claimWinnings = useClaimWinningsMutation();
  const claimRefund = useClaimRefundMutation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Market</TableHead>
          <TableHead>YES Shares</TableHead>
          <TableHead>NO Shares</TableHead>
          <TableHead />
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
            <TableCell>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={claimWinnings.isPending}
                  onClick={() =>
                    claimWinnings.mutate({ marketAddress: balance.marketId as `0x${string}` })
                  }
                >
                  Claim Winnings
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={claimRefund.isPending}
                  onClick={() =>
                    claimRefund.mutate({ marketAddress: balance.marketId as `0x${string}` })
                  }
                >
                  Claim Refund
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
