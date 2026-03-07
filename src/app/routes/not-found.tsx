import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function NotFoundRoute() {
  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-line bg-panel p-6 text-center shadow-threshold">
      <h1 className="text-2xl">Path unavailable</h1>
      <p className="text-sm text-muted">This route is outside active market structure.</p>
      <Button asChild variant="secondary">
        <Link to="/markets">Return to Markets</Link>
      </Button>
    </section>
  );
}
