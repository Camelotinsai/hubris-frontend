import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/cn";
import { useNotifications } from "@/hooks/use-notifications";
import type { AppNotification } from "@/state/atoms/notifications";

function NotificationCard({
  notification,
  onDismiss
}: {
  notification: AppNotification;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(notification.id), notification.durationMs);
    return () => clearTimeout(timer);
  }, [notification.durationMs, notification.id, onDismiss]);

  const toneClassName =
    notification.tone === "success"
      ? "border-positive/55 bg-panel text-text"
      : notification.tone === "error"
        ? "border-risk/55 bg-panel text-text"
        : "border-line-strong bg-panel text-text";

  const icon =
    notification.tone === "success" ? (
      <CheckCircle2 className="h-4 w-4 text-positive" />
    ) : notification.tone === "error" ? (
      <AlertCircle className="h-4 w-4 text-risk" />
    ) : (
      <Info className="h-4 w-4 text-muted" />
    );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn("pointer-events-auto w-[320px] rounded-xl border p-3 shadow-threshold", toneClassName)}
    >
      <div className="flex items-start gap-2.5">
        {icon}
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em]">{notification.title}</p>
          {notification.message ? <p className="mt-1 text-xs text-muted break-all">{notification.message}</p> : null}
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationViewport() {
  const { notifications, dismiss } = useNotifications();

  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,340px)] flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {notifications.map((item) => (
          <NotificationCard key={item.id} notification={item} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
