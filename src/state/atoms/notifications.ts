import { atom } from "jotai";

export type NotificationTone = "success" | "error" | "info";

export interface AppNotification {
  id: string;
  tone: NotificationTone;
  title: string;
  message?: string;
  createdAt: number;
  durationMs: number;
}

export const notificationsAtom = atom<AppNotification[]>([]);
