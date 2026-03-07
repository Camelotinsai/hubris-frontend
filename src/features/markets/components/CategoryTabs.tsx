import { useAtom } from "jotai";

import { track } from "@/lib/analytics";
import type { MarketCategory } from "@/types/enums";
import { cn } from "@/lib/cn";
import { selectedCategoryAtom } from "@/state/atoms/ui";

const categories: MarketCategory[] = ["Trending", "Crypto", "Politics", "Sports", "Tech", "Economy", "Culture"];

export function CategoryTabs() {
  const [category, setCategory] = useAtom(selectedCategoryAtom);

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7" role="tablist" aria-label="Market categories">
      {categories.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={item === category}
          className={cn(
            "h-11 rounded-xl border px-3 text-[11px] font-semibold uppercase tracking-[0.14em]",
            item === category
              ? "border-line-strong bg-panel2 text-text"
              : "border-line bg-panel text-muted hover:text-text"
          )}
          onClick={() => {
            setCategory(item);
            track("market_category_change", { category: item });
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
