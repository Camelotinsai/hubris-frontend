import { NavLink } from "react-router-dom";
import { BarChart3, LayoutGrid, Wallet } from "lucide-react";

import { cn } from "@/lib/cn";
import { ProfileAvatar, SHARED_PROFILE_AVATAR_SEED } from "@/features/shared/components/ProfileAvatar";

const links = [
  { to: "/markets", label: "Markets", icon: LayoutGrid },
  { to: "/trade/btc-150k-2026", label: "Trade", icon: BarChart3 },
  { to: "/portfolio", label: "Portfolio", icon: Wallet }
];

export function Sidebar() {
  return (
    <aside className="sticky top-24 hidden h-fit w-64 rounded-2xl border border-line bg-panel p-2 lg:block">
      <nav className="space-y-1 p-2" aria-label="Primary">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex h-11 items-center gap-2 rounded-xl border border-transparent px-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted",
                isActive ? "border-line-strong bg-panel2 text-text" : "hover:border-line hover:text-text"
              )
            }
          >
            {link.label === "Portfolio" ? (
              <ProfileAvatar className="h-5 w-5 text-[8px]" seed={SHARED_PROFILE_AVATAR_SEED} showStatus={false} />
            ) : (
              <link.icon className="h-4 w-4" />
            )}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
