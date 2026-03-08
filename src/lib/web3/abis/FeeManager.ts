export const feeManagerAbi = [
  {
    type: "function",
    name: "applyFee",
    stateMutability: "view",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "probability", type: "uint256" },
      { name: "isBuy", type: "bool" }
    ],
    outputs: [{ name: "feeAmount", type: "uint256" }]
  },
  {
    type: "function",
    name: "calculateBuyFee",
    stateMutability: "view",
    inputs: [{ name: "probability", type: "uint256" }],
    outputs: [{ name: "fee", type: "uint256" }]
  },
  {
    type: "function",
    name: "calculateSellFee",
    stateMutability: "view",
    inputs: [{ name: "probability", type: "uint256" }],
    outputs: [{ name: "fee", type: "uint256" }]
  },
  {
    type: "function",
    name: "feeConfig",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "maxBuyFee", type: "uint256" },
      { name: "minFee", type: "uint256" },
      { name: "peakSellFee", type: "uint256" },
      { name: "curveAlpha", type: "uint256" },
      { name: "curveSigma", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "FeeConfigUpdated",
    inputs: [
      { name: "maxBuyFee", type: "uint256", indexed: false },
      { name: "minFee", type: "uint256", indexed: false },
      { name: "peakSellFee", type: "uint256", indexed: false },
      { name: "curveAlpha", type: "uint256", indexed: false },
      { name: "curveSigma", type: "uint256", indexed: false }
    ]
  }
] as const;
