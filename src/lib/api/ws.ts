import type { Orderbook } from "@/types/order";
import { env } from "@/lib/env";

type WsEventPayload = {
  orderbook?: Orderbook;
  marketId: string;
};

type EventHandler = (payload: WsEventPayload) => void;

export class HubrisWsClient {
  private readonly listeners = new Set<EventHandler>();

  private timer: number | null = null;
  private socket: WebSocket | null = null;
  private connections = 0;

  subscribe(handler: EventHandler): () => void {
    this.listeners.add(handler);
    return () => this.listeners.delete(handler);
  }

  connect(): void {
    this.connections += 1;
    if (!env.enableWs) return;
    if (this.timer || this.socket) return;

    if (!env.mockData) {
      this.socket = new WebSocket(env.wsUrl);
      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as WsEventPayload;
          this.listeners.forEach((listener) => listener(payload));
        } catch {
          // Ignore malformed ws payloads from upstream.
        }
      };

      this.socket.onclose = () => {
        this.socket = null;
      };

      return;
    }

    this.timer = window.setInterval(() => {
      this.listeners.forEach((listener) => {
        listener({
          marketId: "btc-150k-2026"
        });
      });
    }, 8_000);
  }

  disconnect(): void {
    this.connections = Math.max(0, this.connections - 1);
    if (this.connections !== 0) return;

    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const wsClient = new HubrisWsClient();
