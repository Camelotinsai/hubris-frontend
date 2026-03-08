// Solidity enums: Side { YES=0, NO=1 }  OrderSide { Buy=0, Sell=1 }
const orderTupleComponents = [
  { name: "id", type: "uint256" },
  { name: "trader", type: "address" },
  { name: "side", type: "uint8" },
  { name: "orderSide", type: "uint8" },
  { name: "price", type: "uint256" },
  { name: "quantity", type: "uint256" },
  { name: "filled", type: "uint256" },
  { name: "leverage", type: "uint256" },
  { name: "timestamp", type: "uint256" },
  { name: "isActive", type: "bool" }
] as const;

const positionTupleComponents = [
  { name: "id", type: "uint256" },
  { name: "trader", type: "address" },
  { name: "side", type: "uint8" },
  { name: "shares", type: "uint256" },
  { name: "entryPrice", type: "uint256" },
  { name: "margin", type: "uint256" },
  { name: "borrowed", type: "uint256" },
  { name: "leverage", type: "uint256" },
  { name: "liquidationPrice", type: "uint256" },
  { name: "entryFundingIndex", type: "int256" },
  { name: "isOpen", type: "bool" }
] as const;

export const orderBookAbi = [
  // ── Write ──────────────────────────────────────────────────────────────
  {
    type: "function",
    name: "placeLimitOrder",
    stateMutability: "nonpayable",
    inputs: [
      { name: "side", type: "uint8" },
      { name: "orderSide", type: "uint8" },
      { name: "price", type: "uint256" },
      { name: "quantity", type: "uint256" },
      { name: "leverage", type: "uint256" }
    ],
    outputs: [{ name: "orderId", type: "uint256" }]
  },
  {
    type: "function",
    name: "placeMarketOrder",
    stateMutability: "nonpayable",
    inputs: [
      { name: "side", type: "uint8" },
      { name: "orderSide", type: "uint8" },
      { name: "quantity", type: "uint256" },
      { name: "leverage", type: "uint256" }
    ],
    outputs: [
      { name: "filledQuantity", type: "uint256" },
      { name: "avgPrice", type: "uint256" }
    ]
  },
  {
    type: "function",
    name: "cancelOrder",
    stateMutability: "nonpayable",
    inputs: [{ name: "orderId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "closePosition",
    stateMutability: "nonpayable",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "addMargin",
    stateMutability: "nonpayable",
    inputs: [
      { name: "positionId", type: "uint256" },
      { name: "amount", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "changeLeverage",
    stateMutability: "nonpayable",
    inputs: [
      { name: "side", type: "uint8" },
      { name: "newLeverage", type: "uint256" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "updateFunding",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: []
  },
  // ── Read ───────────────────────────────────────────────────────────────
  {
    type: "function",
    name: "getOrder",
    stateMutability: "view",
    inputs: [{ name: "orderId", type: "uint256" }],
    outputs: [{ name: "", type: "tuple", components: orderTupleComponents }]
  },
  {
    type: "function",
    name: "getTraderOrders",
    stateMutability: "view",
    inputs: [{ name: "trader", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }]
  },
  {
    type: "function",
    name: "getTraderPositions",
    stateMutability: "view",
    inputs: [{ name: "trader", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }]
  },
  {
    type: "function",
    name: "getPosition",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [{ name: "", type: "tuple", components: positionTupleComponents }]
  },
  {
    type: "function",
    name: "positions",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [{ name: "", type: "tuple", components: positionTupleComponents }]
  },
  {
    type: "function",
    name: "activePosition",
    stateMutability: "view",
    inputs: [
      { name: "trader", type: "address" },
      { name: "side", type: "uint8" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getOrderBookDepth",
    stateMutability: "view",
    inputs: [
      { name: "side", type: "uint8" },
      { name: "maxDepth", type: "uint256" }
    ],
    outputs: [
      { name: "bidPrices", type: "uint256[]" },
      { name: "bidQuantities", type: "uint256[]" },
      { name: "askPrices", type: "uint256[]" },
      { name: "askQuantities", type: "uint256[]" }
    ]
  },
  {
    type: "function",
    name: "getMidPrice",
    stateMutability: "view",
    inputs: [{ name: "side", type: "uint8" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getBestBid",
    stateMutability: "view",
    inputs: [{ name: "side", type: "uint8" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getBestAsk",
    stateMutability: "view",
    inputs: [{ name: "side", type: "uint8" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "pendingFunding",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [{ name: "", type: "int256" }]
  },
  {
    type: "function",
    name: "getFundingState",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "rate", type: "int256" },
      { name: "index", type: "int256" },
      { name: "lastUpdate", type: "uint256" },
      { name: "pool", type: "int256" }
    ]
  },
  {
    type: "function",
    name: "isLiquidatable",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "getUnrealizedPnL",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [{ name: "", type: "int256" }]
  },
  {
    type: "function",
    name: "getMarginRatio",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getROE",
    stateMutability: "view",
    inputs: [{ name: "positionId", type: "uint256" }],
    outputs: [{ name: "", type: "int256" }]
  },
  {
    type: "function",
    name: "openInterest",
    stateMutability: "view",
    inputs: [{ name: "side", type: "uint8" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "totalMarginLocked",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "fundingIndex",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "int256" }]
  },
  {
    type: "function",
    name: "currentFundingRate",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "int256" }]
  },
  {
    type: "function",
    name: "accumulatedFees",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getMarket",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "maxLeverage",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "maintenanceMargin",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "nextOrderId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "nextPositionId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  // ── Events ─────────────────────────────────────────────────────────────
  {
    type: "event",
    name: "OrderPlaced",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "trader", type: "address", indexed: true },
      { name: "side", type: "uint8", indexed: false },
      { name: "orderSide", type: "uint8", indexed: false },
      { name: "price", type: "uint256", indexed: false },
      { name: "qty", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "OrderMatched",
    inputs: [
      { name: "bidId", type: "uint256", indexed: false },
      { name: "askId", type: "uint256", indexed: false },
      { name: "price", type: "uint256", indexed: false },
      { name: "qty", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "OrderCancelled",
    inputs: [{ name: "id", type: "uint256", indexed: true }]
  },
  {
    type: "event",
    name: "TradeExecuted",
    inputs: [
      { name: "buyer", type: "address", indexed: true },
      { name: "seller", type: "address", indexed: true },
      { name: "side", type: "uint8", indexed: false },
      { name: "price", type: "uint256", indexed: false },
      { name: "qty", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "FeeCollected",
    inputs: [
      { name: "trader", type: "address", indexed: true },
      { name: "feeAmount", type: "uint256", indexed: false },
      { name: "isBuy", type: "bool", indexed: false }
    ]
  },
  {
    type: "event",
    name: "PositionClosed",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "trader", type: "address", indexed: true },
      { name: "exitPrice", type: "uint256", indexed: false },
      { name: "pnl", type: "int256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "PositionLiquidated",
    inputs: [
      { name: "market", type: "address", indexed: false },
      { name: "id", type: "uint256", indexed: true },
      { name: "trader", type: "address", indexed: true },
      { name: "liquidator", type: "address", indexed: false },
      { name: "price", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "MarginAdded",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "LeverageChanged",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "trader", type: "address", indexed: true },
      { name: "oldLev", type: "uint256", indexed: false },
      { name: "newLev", type: "uint256", indexed: false },
      { name: "newMargin", type: "uint256", indexed: false },
      { name: "newBorrowed", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "FundingParametersUpdated",
    inputs: [
      { name: "maxVelocity", type: "int256", indexed: false },
      { name: "skewScale", type: "uint256", indexed: false },
      { name: "maxRate", type: "int256", indexed: false }
    ]
  }
] as const;
