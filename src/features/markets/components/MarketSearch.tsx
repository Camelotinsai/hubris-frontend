import { Search } from "lucide-react";
import { useAtom } from "jotai";

import { Input } from "@/components/ui/input";
import { marketSearchAtom } from "@/state/atoms/ui";

export function MarketSearch() {
  const [search, setSearch] = useAtom(marketSearchAtom);

  return (
    <label className="relative block">
      <span className="sr-only">Search markets</span>
      <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted" />
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search market question…"
        className="pl-9"
      />
    </label>
  );
}
