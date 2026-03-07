import { Badge } from "@/components/ui/badge";
import { useWorldId } from "@/hooks/use-world-id";

function statusLabel(status: ReturnType<typeof useWorldId>["status"]) {
  switch (status) {
    case "verified":
      return "World ID Verified";
    case "verifying":
      return "Verifying World ID";
    case "failed":
      return "World ID Check Failed";
    default:
      return "World ID Unverified";
  }
}

export function WorldIdBadge() {
  const worldId = useWorldId();

  if (!worldId.walletConnected) {
    return <Badge variant="neutral">World ID: Connect Wallet</Badge>;
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Badge variant={worldId.isVerified ? "positive" : "neutral"}>{statusLabel(worldId.status)}</Badge>
    </div>
  );
}
