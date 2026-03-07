import { NavLink } from "react-router-dom";
import { BarChart3, LayoutGrid, Wallet } from "lucide-react";

import { cn } from "@/lib/cn";
import { ProfileAvatar, SHARED_PROFILE_AVATAR_SEED } from "@/features/shared/components/ProfileAvatar";

const links = [
  { to: "/markets", label: "Markets", icon: LayoutGrid },
  { to: "/trade/btc-150k-2026", label: "Trade", icon: BarChart3 },
  { to: "/portfolio", label: "Portfolio", icon: Wallet }
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-panel/95 px-2 py-3 lg:hidden">
      <ul className="grid grid-cols-3 gap-2">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex h-11 items-center justify-center gap-1 rounded-xl border border-transparent text-[11px] uppercase tracking-[0.14em] text-muted",
                  isActive ? "border-line-strong bg-panel2 text-text" : "hover:text-text"
                )
              }
            >
              {link.label === "Portfolio" ? (
                <ProfileAvatar className="h-4 w-4 text-[7px]" seed={SHARED_PROFILE_AVATAR_SEED} showStatus={false} />
              ) : (
                <link.icon className="h-3.5 w-3.5" />
              )}
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
