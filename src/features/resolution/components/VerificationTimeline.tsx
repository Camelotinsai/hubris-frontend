import { motion, useReducedMotion } from "framer-motion";

import { track } from "@/lib/analytics";
import { formatDateTime } from "@/lib/dates";
import { cn } from "@/lib/cn";
import type { ResolutionEvent } from "@/types/resolution";

interface VerificationTimelineProps {
  events: ResolutionEvent[];
}

export function VerificationTimeline({ events }: VerificationTimelineProps) {
  const reduced = useReducedMotion();

  return (
    <ol className="space-y-2" aria-label="Verification timeline">
      {events.map((event, index) => {
        const motionProps = reduced
          ? {}
          : {
              initial: { opacity: 0, y: 6 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: index * 0.04, duration: 0.22 }
            };

        return (
          <motion.li key={event.id} {...motionProps}>
            <button
              type="button"
              className={cn(
                "w-full rounded-xl border p-3 text-left transition-colors hover:border-line-strong",
                event.status === "completed"
                  ? "border-line-strong"
                  : event.status === "current"
                    ? "border-positive"
                    : "border-line"
              )}
              onClick={() => track("verification_timeline_interaction", { eventId: event.id })}
              aria-label={`Verification event ${event.title}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em]">{event.title}</p>
                <p className="text-[11px] uppercase text-muted">{event.status}</p>
              </div>
              <p className="mt-1 text-xs text-muted">{event.details}</p>
              {event.timestamp ? <p className="mt-2 text-[11px] text-muted">{formatDateTime(event.timestamp)}</p> : null}
            </button>
          </motion.li>
        );
      })}
    </ol>
  );
}
