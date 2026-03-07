import type { OrderType } from "@/types/enums";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { track } from "@/lib/analytics";

interface OrderTypeTabsProps {
  value: OrderType;
  onChange: (value: OrderType) => void;
}

export function OrderTypeTabs({ value, onChange }: OrderTypeTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => {
        const typed = next as OrderType;
        onChange(typed);
        track("order_type_change", { orderType: typed });
      }}
    >
      <TabsList className="w-full">
        <TabsTrigger className="w-1/2" value="MARKET">
          Market
        </TabsTrigger>
        <TabsTrigger className="w-1/2" value="LIMIT">
          Limit
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
