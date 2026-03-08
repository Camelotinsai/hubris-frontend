const marketConfigComponents = [
  { name: "question", type: "string" },
  { name: "imageUrl", type: "string" },
  { name: "category", type: "string" },
  { name: "resolutionTime", type: "uint256" },
  { name: "creationTime", type: "uint256" },
  { name: "collateralToken", type: "address" },
  { name: "maxLeverage", type: "uint256" },
  { name: "maintenanceMargin", type: "uint256" }
] as const;

export const predictionMarketAbi = [
  // ── Write ──────────────────────────────────────────────────────────────
  {
    type: "function",
    name: "mintShares",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "burnShares",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "claimWinnings",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: []
  },
  {
    type: "function",
    name: "claimRefund",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: []
  },
  // ── Read ───────────────────────────────────────────────────────────────
  {
    type: "function",
    name: "getStatus",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }]
  },
  {
    type: "function",
    name: "getConfig",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "tuple", components: marketConfigComponents }]
  },
  {
    type: "function",
    name: "yesToken",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "noToken",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "winningSide",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }]
  },
  {
    type: "function",
    name: "hasClaimed",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "totalSharesMinted",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "orderBook",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "factory",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "yesSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "noSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  // ── Events ─────────────────────────────────────────────────────────────
  {
    type: "event",
    name: "SharesMinted",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "SharesBurned",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "WinningsClaimed",
    inputs: [
      { name: "trader", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "RefundClaimed",
    inputs: [
      { name: "trader", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false }
    ]
  },
  {
    type: "event",
    name: "MarketCancelled",
    inputs: []
  }
] as const;
