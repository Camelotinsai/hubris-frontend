const categoryFallbackByKey: Record<string, string> = {
  crypto: "/market-media/crypto.svg",
  economy: "/market-media/economy.svg",
  politics: "/market-media/politics.svg",
  sports: "/market-media/sports.svg",
  tech: "/market-media/tech.svg"
};

export const DEFAULT_MARKET_IMAGE_FALLBACK = "/market-media/placeholder.svg";

function normalizeCategoryKey(category: string | undefined): string {
  return (category ?? "").trim().toLowerCase();
}

export function getMarketImageFallback(category: string | undefined): string {
  const key = normalizeCategoryKey(category);
  return categoryFallbackByKey[key] ?? DEFAULT_MARKET_IMAGE_FALLBACK;
}

export function resolveMarketImageSrc(
  imageUrl: string | undefined,
  category: string | undefined,
  imageFailed: boolean
): string {
  if (imageUrl && !imageFailed) {
    return imageUrl;
  }

  return getMarketImageFallback(category);
}
