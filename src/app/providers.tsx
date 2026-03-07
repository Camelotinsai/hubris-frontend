import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { RouterProvider } from "react-router-dom";
import { WagmiProvider } from "wagmi";

import { createQueryClient } from "@/lib/query-client";
import { wagmiConfig } from "@/lib/web3/config";
import { router } from "@/app/router";

export function AppProviders() {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <WagmiProvider config={wagmiConfig}>
          <RouterProvider router={router} />
        </WagmiProvider>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
