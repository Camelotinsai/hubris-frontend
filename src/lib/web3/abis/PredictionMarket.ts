export const predictionMarketAbi = [
  {
    type: "function",
    name: "status",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }]
  },
  {
    type: "function",
    name: "submitOrder",
    stateMutability: "nonpayable",
    inputs: [
      { name: "outcome", type: "uint8" },
      { name: "side", type: "uint8" },
      { name: "price", type: "uint256" },
      { name: "size", type: "uint256" },
      { name: "leverage", type: "uint8" }
    ],
    outputs: []
  }
] as const;
