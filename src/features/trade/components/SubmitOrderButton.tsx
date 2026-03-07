import { Button } from "@/components/ui/button";

interface SubmitOrderButtonProps {
  disabled: boolean;
  pending: boolean;
  onClick: () => void;
}

export function SubmitOrderButton({ disabled, pending, onClick }: SubmitOrderButtonProps) {
  return (
    <Button className="w-full" variant="primary" disabled={disabled || pending} onClick={onClick}>
      {pending ? "Submitting" : "Submit Order"}
    </Button>
  );
}
