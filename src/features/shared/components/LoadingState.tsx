import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  lines?: number;
}

export function LoadingState({ lines = 4 }: LoadingStateProps) {
  return (
    <div className="space-y-2" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-full" aria-hidden="true" />
      ))}
    </div>
  );
}
