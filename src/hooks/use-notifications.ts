import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";

import { notificationsAtom, type AppNotification, type NotificationTone } from "@/state/atoms/notifications";

interface NotifyPayload {
  title: string;
  message?: string;
  durationMs?: number;
}

const DEFAULT_DURATION_MS: Record<NotificationTone, number> = {
  success: 4200,
  error: 5600,
  info: 4200
};

function createNotificationId() {
  return `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useNotifications() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const notify = useCallback(
    (tone: NotificationTone, payload: NotifyPayload) => {
      const next: AppNotification = {
        id: createNotificationId(),
        tone,
        title: payload.title,
        message: payload.message,
        createdAt: Date.now(),
        durationMs: payload.durationMs ?? DEFAULT_DURATION_MS[tone]
      };

      setNotifications((current) => [...current.slice(-2), next]);
      return next.id;
    },
    [setNotifications]
  );

  const dismiss = useCallback(
    (id: string) => {
      setNotifications((current) => current.filter((item) => item.id !== id));
    },
    [setNotifications]
  );

  return useMemo(
    () => ({
      notifications,
      dismiss,
      notify,
      notifySuccess: (payload: NotifyPayload) => notify("success", payload),
      notifyError: (payload: NotifyPayload) => notify("error", payload),
      notifyInfo: (payload: NotifyPayload) => notify("info", payload)
    }),
    [dismiss, notifications, notify]
  );
}
