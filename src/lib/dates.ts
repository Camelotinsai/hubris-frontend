export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(iso));
}

export function timeUntil(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 0) return "Expired";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
