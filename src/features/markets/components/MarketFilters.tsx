import { useAtom } from "jotai";

import { marketsAccessFilterAtom, marketsStatusFilterAtom } from "@/state/atoms/ui";

export function MarketFilters() {
  const [status, setStatus] = useAtom(marketsStatusFilterAtom);
  const [access, setAccess] = useAtom(marketsAccessFilterAtom);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
        Status
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          className="h-10 w-36 rounded-xl border border-line bg-panel2 px-2 text-xs uppercase tracking-[0.12em] text-text"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="resolved">Resolved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
        Access
        <select
          value={access}
          onChange={(event) => setAccess(event.target.value as typeof access)}
          className="h-10 w-40 rounded-xl border border-line bg-panel2 px-2 text-xs uppercase tracking-[0.12em] text-text"
        >
          <option value="all">All</option>
          <option value="human-only">Human Only</option>
          <option value="standard">Standard</option>
        </select>
      </label>
    </div>
  );
}
