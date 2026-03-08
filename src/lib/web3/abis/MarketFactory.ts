export const marketFactoryAbi = [
  // ── Read ───────────────────────────────────────────────────────────────
  {
    type: "function",
    name: "markets",
    stateMutability: "view",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "isMarket",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "currentMarkets",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }]
  },
  {
    type: "function",
    name: "getMarketOrderBook",
    stateMutability: "view",
    inputs: [{ name: "marketAddr", type: "address" }],
    outputs: [{ name: "orderBook", type: "address" }]
  },
  {
    type: "function",
    name: "getMarketGroupCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getMarketGroupIdOf",
    stateMutability: "view",
    inputs: [{ name: "market", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getMarketGroup",
    stateMutability: "view",
    inputs: [{ name: "groupId", type: "uint256" }],
    outputs: [
      { name: "question", type: "string" },
      { name: "imageUrl", type: "string" },
      { name: "category", type: "string" },
      { name: "outcomeLabels", type: "string[]" },
      { name: "outcomeMarkets", type: "address[]" },
      { name: "resolutionTime", type: "uint256" },
      { name: "resolved", type: "bool" },
      { name: "winningOutcomeIndex", type: "uint256" }
    ]
  },
  {
    type: "function",
    name: "getGroupOutcomeMarkets",
    stateMutability: "view",
    inputs: [{ name: "groupId", type: "uint256" }],
    outputs: [{ name: "", type: "address[]" }]
  },
  {
    type: "function",
    name: "vault",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "feeManager",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "collateralToken",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "defaultMaxLeverage",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  // ── Write ──────────────────────────────────────────────────────────────
  {
    type: "function",
    name: "requestMarketResolution",
    stateMutability: "nonpayable",
    inputs: [
      { name: "marketOrGroupId", type: "uint256" },
      { name: "isGroup", type: "bool" }
    ],
    outputs: []
  },
  // ── Events ─────────────────────────────────────────────────────────────
  {
    type: "event",
    name: "MarketCreated",
    inputs: [
      { name: "market", type: "address", indexed: true },
      { name: "question", type: "string", indexed: false },
      { name: "resolutionTime", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "MarketResolved",
    inputs: [{ name: "marketAddr", type: "address", indexed: true }]
  },
  {
    type: "event",
    name: "MarketGroupCreated",
    inputs: [
      { name: "groupId", type: "uint256", indexed: true },
      { name: "question", type: "string", indexed: false },
      { name: "markets", type: "address[]", indexed: false },
      { name: "resolutionTime", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "MarketGroupResolved",
    inputs: [
      { name: "groupId", type: "uint256", indexed: true },
      { name: "winningOutcomeIndex", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "MarketResolutionRequest",
    inputs: [
      { name: "marketOrGroupId", type: "uint256", indexed: false },
      { name: "isGroup", type: "bool", indexed: false },
      { name: "question", type: "string", indexed: false }
    ]
  },
  {
    type: "event",
    name: "ComponentsRegistered",
    inputs: [
      { name: "market", type: "address", indexed: true },
      { name: "orderBook", type: "address", indexed: false }
    ]
  }
] as const;
