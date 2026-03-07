import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Data unavailable", description, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-risk/50 bg-panel p-6 shadow-threshold">
      <h3 className="text-sm tracking-[0.16em] text-risk">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
      {onRetry ? (
        <Button className="mt-4" variant="risk" size="sm" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
