import { useAtomValue } from "jotai";

import { cn } from "@/lib/cn";
import { createAvatarBlend } from "@/features/shared/components/avatar-style";
import { profileAvatarDataUrlAtom } from "@/state/atoms/profile";

type ProfileAvatarProps = {
  className?: string;
  initials?: string;
  seed?: string;
  showStatus?: boolean;
};

export const SHARED_PROFILE_AVATAR_SEED = "shared-profile-avatar";

export function ProfileAvatar({ className, initials = "", seed, showStatus = true }: ProfileAvatarProps) {
  const blend = createAvatarBlend(seed ?? SHARED_PROFILE_AVATAR_SEED);
  const hasInitials = initials.trim().length > 0;
  const profileAvatarDataUrl = useAtomValue(profileAvatarDataUrlAtom);

  return (
    <span
      aria-hidden="true"
      style={blend}
      className={cn(
        "relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-strong text-[10px] font-semibold tracking-[0.08em] text-text shadow-[0_10px_24px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      {profileAvatarDataUrl ? (
        <img src={profileAvatarDataUrl} alt="Profile avatar" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.26)_10%,transparent_46%,rgba(0,0,0,0.52)_88%)] mix-blend-screen"
      />
      {hasInitials ? <span className="relative z-[1]">{initials}</span> : null}
      {showStatus ? (
        <span className="absolute bottom-0 right-0 z-[2] h-2.5 w-2.5 rounded-full border border-panel bg-positive" />
      ) : null}
    </span>
  );
}
