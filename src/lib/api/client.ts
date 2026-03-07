import { env } from "@/lib/env";

export async function apiGet<T>(path: string, fallback: () => Promise<T>): Promise<T> {
  if (env.mockData) {
    return fallback();
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), env.apiTimeoutMs);

  try {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch {
    return fallback();
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function sleep(ms = 180): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
