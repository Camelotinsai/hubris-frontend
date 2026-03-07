export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export function track(name: string, payload: AnalyticsPayload = {}): void {
  if (import.meta.env.DEV) {
    console.info("[analytics]", name, payload);
  }
}
