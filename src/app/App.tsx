import { Outlet } from "react-router-dom";

import { AppShell } from "@/features/shell/AppShell";

export function App() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
