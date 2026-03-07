import { Link } from "react-router-dom";

import { NetworkBadge } from "@/features/auth/NetworkBadge";
import { WorldIdBadge } from "@/features/auth/WorldIdBadge";
import { WalletConnectButton } from "@/features/auth/WalletConnectButton";
import { useWallet } from "@/hooks/use-wallet";
import { useWorldId } from "@/hooks/use-world-id";
import { LogoMark } from "@/features/shared/components/LogoMark";
import { ProfileAvatar, SHARED_PROFILE_AVATAR_SEED } from "@/features/shared/components/ProfileAvatar";
import { Wordmark } from "@/features/shared/components/Wordmark";

export function Topbar() {
  const wallet = useWallet();
  const worldId = useWorldId();

  return (
    <header className="sticky top-0 z-20 px-2 py-2 md:px-4">
      <div className="mx-auto flex h-16 w-full max-w-[1420px] items-center justify-between rounded-2xl border border-line bg-bg/90 px-4 backdrop-blur">
        <Link to="/markets" className="flex items-center gap-2">
          <LogoMark />
          <Wordmark />
        </Link>
        <div className="flex items-center gap-2">
          <NetworkBadge />
          {worldId.isVerified && <WorldIdBadge />}
          {wallet.isConnected && (
            <Link to="/portfolio" aria-label="Open Portfolio" title="Open Portfolio" className="rounded-full">
              <ProfileAvatar seed={SHARED_PROFILE_AVATAR_SEED} showStatus={false} />
            </Link>
          )}
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}
