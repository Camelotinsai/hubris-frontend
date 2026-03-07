import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.28, ease: "easeOut" as const }
      };

  return (
    <motion.header
      {...motionProps}
      className="threshold-line flex flex-col gap-3 rounded-2xl border border-line bg-panel/70 p-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h1 className="text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </motion.header>
  );
}
