import { atom } from "jotai";

export type WorldIdStatus = "unverified" | "verifying" | "verified" | "failed";

export const worldIdStatusAtom = atom<WorldIdStatus>("unverified");
export const worldIdProofAtom = atom<string | null>(null);
export const worldIdVerifiedAtAtom = atom<string | null>(null);
