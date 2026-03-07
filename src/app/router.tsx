import { createBrowserRouter } from "react-router-dom";

import { App } from "@/app/App";
import { MarketsRoute } from "@/app/routes/markets";
import { PortfolioRoute } from "@/app/routes/portfolio";
import { TradeRoute } from "@/app/routes/trade";
import { NotFoundRoute } from "@/app/routes/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <MarketsRoute />
      },
      {
        path: "markets",
        element: <MarketsRoute />
      },
      {
        path: "trade/:marketId",
        element: <TradeRoute />
      },
      {
        path: "portfolio",
        element: <PortfolioRoute />
      },
      {
        path: "*",
        element: <NotFoundRoute />
      }
    ]
  }
]);
