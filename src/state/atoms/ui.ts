import { atom } from "jotai";

import type { MarketCategory } from "@/types/enums";
import type { MarketAccessFilter } from "@/types/market";

export const sidebarOpenAtom = atom(false);

export const selectedCategoryAtom = atom<MarketCategory>("Trending");

export const marketSearchAtom = atom("");

export const marketsStatusFilterAtom = atom<"all" | "active" | "paused" | "resolved" | "cancelled">("all");

export const marketsAccessFilterAtom = atom<MarketAccessFilter>("all");
