import { env } from "@/lib/env";

export const contracts = {
  marketFactory: env.contracts.marketFactory,
  feeManager: env.contracts.feeManager,
  vault: env.contracts.vault,
  usdc: env.contracts.usdc,
  orderBook: env.contracts.orderBook,
  predictionMarket: env.contracts.predictionMarket,
  shareToken: env.contracts.shareToken
};
