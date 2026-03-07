import { atom } from "jotai";

export const portfolioTabAtom = atom<"positions" | "orders" | "history" | "shares">("positions");
