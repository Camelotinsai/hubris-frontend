import type { PropsWithChildren } from "react";

import { PopoverLayerProvider } from "@/components/ui/popover-layer";
import { DisconnectedStatusBanner } from "@/features/auth/DisconnectedStatusBanner";
import { Topbar } from "@/features/shell/Topbar";
import { Sidebar } from "@/features/shell/Sidebar";
import { MobileNav } from "@/features/shell/MobileNav";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <PopoverLayerProvider>
      <div className="min-h-screen relative isolate bg-bg text-text">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-lg border border-line-strong bg-panel px-3 py-2 text-xs uppercase tracking-[0.12em] text-text focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-[-8%] bg-gradient-to-br from-positive/20 via-transparent to-risk/20 blur-3xl animate-gradient-breathe motion-reduce:animate-none" />
          <div className="absolute -left-24 top-[-12%] h-[460px] w-[460px] rounded-full bg-gradient-to-tr from-positive/30 via-positive/10 to-transparent blur-3xl animate-gradient-breathe [animation-delay:1.8s] motion-reduce:animate-none" />
          <div className="absolute -right-20 bottom-[-18%] h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-risk/20 via-positive/10 to-transparent blur-3xl animate-gradient-breathe [animation-delay:3.4s] motion-reduce:animate-none" />
        </div>
        <div className="relative z-10">
          <Topbar />
          <div className="mx-auto flex w-full max-w-[1420px] gap-4 px-2 md:px-4">
            <Sidebar />
            <main id="main-content" className="w-full px-2 pb-28 pt-6 lg:px-2 lg:pb-10">
              <DisconnectedStatusBanner />
              {children}
            </main>
          </div>
          <MobileNav />
        </div>
      </div>
    </PopoverLayerProvider>
  );
}
