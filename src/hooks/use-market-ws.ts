import { useEffect } from "react";

import { track } from "@/lib/analytics";
import { wsClient } from "@/lib/api/ws";

export function useMarketWs(marketId: string, onPulse: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled || !marketId) {
      return;
    }

    const unsubscribe = wsClient.subscribe((payload) => {
      if (payload.marketId === marketId) {
        onPulse();
      }
    });

    wsClient.connect();
    track("market_ws_subscribe", { marketId });

    return () => {
      unsubscribe();
      wsClient.disconnect();
      track("market_ws_unsubscribe", { marketId });
    };
  }, [enabled, marketId, onPulse]);
}
