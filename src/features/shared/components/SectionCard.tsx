import type { PropsWithChildren, ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface SectionCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <Card className="bg-panel/90">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold tracking-[0.16em] text-muted">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-muted">{subtitle}</p> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
