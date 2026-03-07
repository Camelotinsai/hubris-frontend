import { useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";

import { track } from "@/lib/analytics";
import { useWallet } from "@/hooks/use-wallet";
import { worldIdProofAtom, worldIdStatusAtom, worldIdVerifiedAtAtom } from "@/state/atoms/world-id";

interface WorldIdProofPayload {
  proofId: string;
  verifiedAt: string;
}

async function requestWorldIdProof(address: string): Promise<WorldIdProofPayload> {
  await new Promise((resolve) => {
    setTimeout(resolve, 900);
  });

  return {
    proofId: `wid_${address.slice(2, 8)}_${Date.now().toString(36)}`,
    verifiedAt: new Date().toISOString()
  };
}

export function useWorldId() {
  const wallet = useWallet();
  const [status, setStatus] = useAtom(worldIdStatusAtom);
  const [proofId, setProofId] = useAtom(worldIdProofAtom);
  const [verifiedAt, setVerifiedAt] = useAtom(worldIdVerifiedAtAtom);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!wallet.address) {
        throw new Error("Wallet connection required");
      }

      return requestWorldIdProof(wallet.address);
    },
    onMutate: () => {
      setStatus("verifying");
      track("world_id_verify_start", {});
    },
    onSuccess: (payload) => {
      setStatus("verified");
      setProofId(payload.proofId);
      setVerifiedAt(payload.verifiedAt);
      track("world_id_verify_success", { proofId: payload.proofId });
    },
    onError: () => {
      setStatus("failed");
      track("world_id_verify_failed", {});
    }
  });

  useEffect(() => {
    if (wallet.isConnected) return;
    setStatus("unverified");
    setProofId(null);
    setVerifiedAt(null);
  }, [setProofId, setStatus, setVerifiedAt, wallet.isConnected]);

  return useMemo(
    () => ({
      status,
      isVerified: status === "verified",
      proofId,
      verifiedAt,
      isPending: status === "verifying",
      canVerify: wallet.isConnected && status !== "verified" && status !== "verifying",
      walletConnected: wallet.isConnected,
      verify: () => mutation.mutate()
    }),
    [mutation, proofId, status, verifiedAt, wallet.isConnected]
  );
}
