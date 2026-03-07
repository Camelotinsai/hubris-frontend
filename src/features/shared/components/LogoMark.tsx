import { cn } from "@/lib/cn";

interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  return <img src="/logo.svg" alt="" aria-hidden="true" className={cn("h-8 w-8 shrink-0", className)} />;
}
