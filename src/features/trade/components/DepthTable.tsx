import type { OrderbookLevel } from "@/types/order";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/format";

interface DepthTableProps {
  title: string;
  levels: OrderbookLevel[];
}

export function DepthTable({ title, levels }: DepthTableProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs tracking-[0.14em] text-muted">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Price</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Cum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-muted">
                No depth available
              </TableCell>
            </TableRow>
          ) : (
            levels.map((level, index) => (
              <TableRow key={`${title}-${index}`}>
                <TableCell>{formatNumber(level.price * 100, 2)}%</TableCell>
                <TableCell>{formatNumber(level.size, 0)}</TableCell>
                <TableCell>{formatNumber(level.cumulative, 0)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
