import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const links = [
  { to: "/markets", label: "Markets" },
  { to: "/trade/btc-150k-2026", label: "Trade" },
  { to: "/portfolio", label: "Portfolio" }
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="hidden sm:flex">
          <Search className="h-4 w-4" />
          Command
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Navigate</DialogTitle>
          <DialogDescription>Cross the threshold.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="flex h-10 items-center rounded-xl border border-line px-3 text-sm text-muted hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
