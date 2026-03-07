import { atomWithStorage } from "jotai/utils";

export const profileAvatarDataUrlAtom = atomWithStorage<string | null>("hubris.profile-avatar", null);
