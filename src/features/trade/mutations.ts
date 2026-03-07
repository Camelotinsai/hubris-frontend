import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TradeTicketState } from "@/state/atoms/trade";

interface SubmitTradePayload {
  marketId: string;
  ticket: TradeTicketState;
}

async function submitTrade(payload: SubmitTradePayload): Promise<{ txHash: string }> {
  await new Promise((resolve) => {
    setTimeout(resolve, 800);
  });

  return {
    txHash: `0xtrade${payload.marketId.replace(/-/g, "").slice(0, 24)}`
  };
}

export function useSubmitTradeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["open-orders"] });
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    }
  });
}
