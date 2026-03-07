import type { ResolutionState } from "@/types/resolution";

export function resolutionHeadline(state: ResolutionState): string {
  if (state.marketStatus === "resolved") {
    return "Resolved by oracle. Settled by code.";
  }

  if (state.marketStatus === "paused") {
    return "Market paused pending verification conditions.";
  }

  return "Oracle-backed verification in progress.";
}
