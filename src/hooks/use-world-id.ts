import { useEffect, useMemo, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { deviceLegacy, type IDKitResult, type RpContext, useIDKitRequest } from "@worldcoin/idkit";

import { track } from "@/lib/analytics";
import { env } from "@/lib/env";
import { useWallet } from "@/hooks/use-wallet";
import { worldIdProofAtom, worldIdStatusAtom, worldIdVerifiedAtAtom } from "@/state/atoms/world-id";

interface WorldIdProofPayload {
  proofId: string;
  verifiedAt: string;
}

type JsonRecord = Record<string, unknown>;

const RP_CONTEXT_FALLBACK: RpContext = {
  rp_id: "rp_pending",
  nonce: "pending",
  created_at: 0,
  expires_at: 0,
  signature: "0x"
};

function unwrapData(payload: unknown): JsonRecord {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const record = payload as JsonRecord;
  const nested = record.data;
  if (!nested || typeof nested !== "object") {
    return record;
  }

  return nested as JsonRecord;
}

function isRpContext(value: unknown): value is RpContext {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.rp_id === "string" &&
    typeof candidate.nonce === "string" &&
    typeof candidate.created_at === "number" &&
    typeof candidate.expires_at === "number" &&
    typeof candidate.signature === "string"
  );
}

function fallbackProofId(result: IDKitResult): string {
  const firstResponse = result.responses[0] as Record<string, unknown> | undefined;
  const nullifier = firstResponse?.nullifier;

  if (typeof nullifier === "string" && nullifier.length > 8) {
    return `wid_${nullifier.slice(2, 14)}`;
  }

  return `wid_${result.nonce.slice(0, 12)}`;
}

async function requestWorldIdRpContext(address: string): Promise<RpContext> {
  const response = await fetch(`${env.apiBaseUrl}${env.endpoints.worldIdSignature}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: env.worldId.action,
      signal: address.toLowerCase(),
      walletAddress: address
    })
  });

  if (!response.ok) {
    throw new Error(`World ID signature request failed: ${response.status}`);
  }

  const body = unwrapData((await response.json()) as unknown);
  const rp_context = body.rp_context ?? body.rpContext;

  if (!isRpContext(rp_context)) {
    throw new Error("World ID signature response missing rp_context");
  }

  return rp_context;
}

async function verifyWorldIdResult(address: string, result: IDKitResult): Promise<WorldIdProofPayload> {
  const response = await fetch(`${env.apiBaseUrl}${env.endpoints.worldIdVerify}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: env.worldId.action,
      signal: address.toLowerCase(),
      walletAddress: address,
      proof: result
    })
  });

  if (!response.ok) {
    throw new Error(`World ID verify request failed: ${response.status}`);
  }

  const body = unwrapData((await response.json()) as unknown);
  const proofId = typeof body.proofId === "string" ? body.proofId : fallbackProofId(result);
  const verifiedAt = typeof body.verifiedAt === "string" ? body.verifiedAt : new Date().toISOString();

  return {
    proofId,
    verifiedAt
  };
}

export function useWorldId() {
  const wallet = useWallet();
  const [status, setStatus] = useAtom(worldIdStatusAtom);
  const [proofId, setProofId] = useAtom(worldIdProofAtom);
  const [verifiedAt, setVerifiedAt] = useAtom(worldIdVerifiedAtAtom);
  const [rpContext, setRpContext] = useState<RpContext>(RP_CONTEXT_FALLBACK);
  const [openSequence, setOpenSequence] = useState(0);
  const openedSequenceRef = useRef(0);
  const verifiedNonceRef = useRef<string | null>(null);

  const hasWorldIdConfig = env.worldId.appId.length > 0 && env.worldId.action.length > 0;

  const flow = useIDKitRequest({
    app_id: (hasWorldIdConfig ? env.worldId.appId : "app_config_missing") as `app_${string}`,
    action: hasWorldIdConfig ? env.worldId.action : "world-id-config-missing",
    rp_context: rpContext,
    allow_legacy_proofs: env.worldId.allowLegacyProofs,
    environment: env.worldId.environment,
    preset: deviceLegacy({ signal: wallet.address?.toLowerCase() ?? "wallet-disconnected" })
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!wallet.address) {
        throw new Error("Wallet connection required");
      }

      if (!hasWorldIdConfig) {
        throw new Error("World ID config missing");
      }

      return requestWorldIdRpContext(wallet.address);
    },
    onMutate: () => {
      setStatus("verifying");
      track("world_id_verify_start", {});
    },
    onSuccess: (nextContext) => {
      setRpContext(nextContext);
      setOpenSequence((current) => current + 1);
    },
    onError: (error) => {
      setStatus("failed");
      track("world_id_verify_failed", {
        reason: error instanceof Error ? error.message : "unknown"
      });
    }
  });

  useEffect(() => {
    if (openSequence <= 0) {
      return;
    }

    if (openedSequenceRef.current === openSequence) {
      return;
    }

    openedSequenceRef.current = openSequence;
    flow.reset();
    flow.open();
  }, [flow, openSequence]);

  useEffect(() => {
    if (!flow.isSuccess || !flow.result || !wallet.address) {
      return;
    }

    if (verifiedNonceRef.current === flow.result.nonce) {
      return;
    }

    verifiedNonceRef.current = flow.result.nonce;

    const run = async () => {
      try {
        const payload = await verifyWorldIdResult(wallet.address as string, flow.result as IDKitResult);
        setStatus("verified");
        setProofId(payload.proofId);
        setVerifiedAt(payload.verifiedAt);
        track("world_id_verify_success", { proofId: payload.proofId });
      } catch (error) {
        setStatus("failed");
        track("world_id_verify_failed", {
          reason: error instanceof Error ? error.message : "unknown"
        });
      } finally {
        flow.reset();
      }
    };

    void run();
  }, [flow, setProofId, setStatus, setVerifiedAt, wallet.address]);

  useEffect(() => {
    if (!flow.isError) {
      return;
    }

    setStatus("failed");
    track("world_id_verify_failed", {
      reason: flow.errorCode ?? "unknown"
    });
    flow.reset();
  }, [flow, setStatus]);

  useEffect(() => {
    if (wallet.isConnected) return;
    flow.reset();
    setRpContext(RP_CONTEXT_FALLBACK);
    setOpenSequence(0);
    openedSequenceRef.current = 0;
    verifiedNonceRef.current = null;
    setStatus("unverified");
    setProofId(null);
    setVerifiedAt(null);
  }, [flow, setProofId, setStatus, setVerifiedAt, wallet.isConnected]);

  const isPending =
    status === "verifying" || flow.isAwaitingUserConnection || flow.isAwaitingUserConfirmation;

  return useMemo(
    () => ({
      status,
      isVerified: status === "verified",
      proofId,
      verifiedAt,
      isPending,
      canVerify: wallet.isConnected && hasWorldIdConfig && status !== "verified" && !isPending,
      walletConnected: wallet.isConnected,
      isConfigured: hasWorldIdConfig,
      verify: () => mutation.mutate()
    }),
    [hasWorldIdConfig, isPending, mutation, proofId, status, verifiedAt, wallet.isConnected]
  );
}
