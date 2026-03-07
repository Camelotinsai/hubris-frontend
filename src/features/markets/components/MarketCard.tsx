import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePopoverLayer } from "@/components/ui/popover-layer";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { formatCompactUsd, formatNumber, formatPct, formatSignedBps } from "@/lib/format";
import { timeUntil } from "@/lib/dates";
import type { MarketCardModel } from "@/features/markets/adapters";
import { MarketStatusPill } from "@/features/markets/components/MarketStatusPill";
import { getMarketImageFallback, resolveMarketImageSrc } from "@/features/markets/image-fallback";

interface MarketCardProps {
  market: MarketCardModel;
  worldIdVerified: boolean;
}

const mediaTintByCategory: Record<string, string> = {
  Crypto: "from-positive/25 to-panel2",
  Economy: "from-slate-500/30 to-panel2",
  Tech: "from-cyan-300/20 to-panel2",
  Politics: "from-emerald-300/20 to-panel2",
  Sports: "from-sky-300/20 to-panel2",
  Culture: "from-zinc-300/20 to-panel2",
  Trending: "from-neutral-300/20 to-panel2"
};

const cardAuraByCategory: Record<string, string> = {
  Crypto: "from-emerald-400/16 via-transparent to-cyan-300/14",
  Economy: "from-amber-300/14 via-transparent to-slate-300/14",
  Tech: "from-cyan-300/16 via-transparent to-indigo-300/14",
  Politics: "from-emerald-300/16 via-transparent to-sky-300/14",
  Sports: "from-sky-300/18 via-transparent to-indigo-300/14",
  Culture: "from-fuchsia-300/16 via-transparent to-rose-300/14",
  Trending: "from-violet-300/14 via-transparent to-amber-300/12"
};

export function MarketCard({ market, worldIdVerified }: MarketCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [fallbackImageFailed, setFallbackImageFailed] = useState(false);
  const [joinPopoverOpen, setJoinPopoverOpen] = useState(false);
  const [joinPopoverPosition, setJoinPopoverPosition] = useState<{ left: number; top: number; width: number } | null>(null);
  const joinPopoverAnchorRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { container: popoverContainer } = usePopoverLayer();
  const fallbackImageSrc = getMarketImageFallback(market.category);
  const imageSrc = resolveMarketImageSrc(market.imageUrl, market.category, imageFailed);
  const isFallbackImage = imageSrc === fallbackImageSrc;
  const showDecorativeFallback = fallbackImageFailed;
  const tradeTarget = market.layout === "multi" ? market.primaryMarketId : market.id;
  const requiresWorldIdVerification = market.humanOnly && !worldIdVerified;

  useEffect(() => {
    setImageFailed(false);
    setFallbackImageFailed(false);
  }, [market.id, market.imageUrl, market.category]);

  useEffect(() => {
    if (!requiresWorldIdVerification) {
      setJoinPopoverOpen(false);
    }
  }, [market.id, requiresWorldIdVerification]);

  const updateJoinPopoverPosition = useCallback(() => {
    const anchor = joinPopoverAnchorRef.current;
    if (!anchor) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const viewportPadding = 8;
    const maxWidth = Math.max(240, window.innerWidth - viewportPadding * 2);
    const width = Math.min(rect.width, maxWidth);
    const left = Math.min(Math.max(rect.left, viewportPadding), window.innerWidth - width - viewportPadding);
    const top = Math.max(rect.top, viewportPadding);

    setJoinPopoverPosition({ left, top, width });
  }, []);

  useLayoutEffect(() => {
    if (!joinPopoverOpen || !requiresWorldIdVerification) {
      return;
    }

    updateJoinPopoverPosition();

    window.addEventListener("resize", updateJoinPopoverPosition);
    window.addEventListener("scroll", updateJoinPopoverPosition, true);

    return () => {
      window.removeEventListener("resize", updateJoinPopoverPosition);
      window.removeEventListener("scroll", updateJoinPopoverPosition, true);
    };
  }, [joinPopoverOpen, requiresWorldIdVerification, updateJoinPopoverPosition]);

  function handleJoinClick(
    event: MouseEvent<HTMLAnchorElement>,
    targetMarketId: string,
    source: "open" | "outcome",
    outcome?: "YES" | "NO"
  ) {
    if (requiresWorldIdVerification) {
      event.preventDefault();
      setJoinPopoverOpen(true);
      track("market_card_join_blocked_world_id", {
        marketId: targetMarketId,
        source,
        outcome
      });
      return;
    }

    track("market_card_click", { marketId: targetMarketId, outcome });
  }

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.24, ease: "easeOut" as const }
      };

  return (
    <motion.article {...motionProps}>
      <Card className="relative h-full overflow-hidden bg-gradient-to-b from-panel2/70 to-panel">
        <div
          className={cn(
            "pointer-events-none absolute inset-[-10%] bg-gradient-to-br opacity-70 blur-3xl animate-gradient-breathe motion-reduce:animate-none",
            cardAuraByCategory[market.category] ?? "from-zinc-300/16 via-transparent to-zinc-400/12"
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-gradient-to-br opacity-55 blur-3xl animate-gradient-breathe [animation-delay:1.2s] motion-reduce:animate-none",
            cardAuraByCategory[market.category] ?? "from-zinc-300/16 via-transparent to-zinc-400/12"
          )}
        />
        <div className="relative z-[1]">
          <CardHeader className="space-y-4">
            <div
              className={cn(
                "relative h-28 overflow-hidden rounded-xl border border-line bg-gradient-to-br",
                mediaTintByCategory[market.category] ?? "from-zinc-400/20 to-panel2"
              )}
            >
              {!showDecorativeFallback ? (
                <img
                  src={imageSrc}
                  alt={market.imageAlt ?? `${market.category} ${isFallbackImage ? "placeholder" : "market"} visual`}
                  width={640}
                  height={280}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (!imageFailed && market.imageUrl) {
                      setImageFailed(true);
                      return;
                    }

                    setFallbackImageFailed(true);
                  }}
                />
              ) : null}
              {showDecorativeFallback ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-positive/10" />
                  <div className="absolute -left-8 top-1/3 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -right-6 bottom-0 h-28 w-28 rounded-full bg-positive/20 blur-2xl" />
                </>
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-bg/20 to-transparent" />
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default">{market.category}</Badge>
                {market.humanOnly ? <Badge variant="neutral">Human Only</Badge> : null}
                {market.feeDiscountPct > 0 ? <Badge variant="positive">Fee -{formatNumber(market.feeDiscountPct, 0)}%</Badge> : null}
              </div>
              <MarketStatusPill status={market.status} />
            </div>
            <h3 className="text-sm leading-tight text-text">{market.question}</h3>
          </CardHeader>
          <CardContent className="space-y-5 text-sm">
            {market.layout === "multi" && market.relatedOutcomes ? (
              <div className="space-y-3">
                {market.relatedOutcomes.map((row) => (
                  <div key={row.marketId} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-xl border border-line p-3">
                    <p className="text-sm font-medium text-text">{row.label}</p>
                    <p className="kpi-number text-sm font-semibold text-muted">{formatNumber(row.probability * 100, 0)}%</p>
                    <Link
                      to={`/trade/${row.marketId}?outcome=YES`}
                      className="flex h-9 min-w-16 items-center justify-center rounded-lg border border-positive/60 bg-positive/10 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-positive transition hover:border-positive hover:bg-positive/20 hover:brightness-110"
                      onClick={(event) => handleJoinClick(event, row.marketId, "outcome", "YES")}
                    >
                      Yes
                    </Link>
                    <Link
                      to={`/trade/${row.marketId}?outcome=NO`}
                      className="flex h-9 min-w-16 items-center justify-center rounded-lg border border-risk/60 bg-risk/10 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-risk transition hover:border-risk hover:bg-risk/20 hover:brightness-110"
                      onClick={(event) => handleJoinClick(event, row.marketId, "outcome", "NO")}
                    >
                      No
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to={`/trade/${tradeTarget}?outcome=YES`}
                  className="rounded-xl border border-line-strong bg-positive/5 p-3 transition hover:border-positive/70 hover:bg-positive/10 hover:brightness-110 hover:shadow-[inset_0_0_28px_rgba(0,255,136,0.18),0_0_30px_rgba(0,255,136,0.2)]"
                  onClick={(event) => handleJoinClick(event, tradeTarget, "outcome", "YES")}
                >
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted">YES</p>
                  <p className="kpi-number mt-1 text-base font-semibold text-positive">{formatPct(market.yesPrice)}</p>
                </Link>
                <Link
                  to={`/trade/${tradeTarget}?outcome=NO`}
                  className="rounded-xl border border-line-strong bg-risk/5 p-3 transition hover:border-risk/70 hover:bg-risk/10 hover:brightness-110 hover:shadow-[inset_0_0_28px_rgba(255,51,68,0.18),0_0_30px_rgba(255,51,68,0.2)]"
                  onClick={(event) => handleJoinClick(event, tradeTarget, "outcome", "NO")}
                >
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted">NO</p>
                  <p className="kpi-number mt-1 text-base font-semibold text-risk">{formatPct(market.noPrice)}</p>
                </Link>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-muted">
              <p>Resolves {timeUntil(market.resolutionTime)}</p>
              <p className="text-right">Cap {market.leverageCap}x</p>
              <p>Vol {formatCompactUsd(market.volume24h)}</p>
              <p className="text-right">OI {formatCompactUsd(market.openInterest)}</p>
              <p>Funding {formatSignedBps(market.fundingRateBps)}</p>
            </div>

            <div ref={joinPopoverAnchorRef} className="relative">
              <Link
                to={`/trade/${tradeTarget}`}
                className="flex h-11 items-center justify-between rounded-xl border border-line px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted hover:border-line-strong hover:text-text"
                onClick={(event) => handleJoinClick(event, tradeTarget, "open")}
              >
                {requiresWorldIdVerification ? "Join Human-only Market" : "Open Trade"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            {joinPopoverOpen && joinPopoverPosition && popoverContainer
              ? createPortal(
                  <div
                    role="dialog"
                    aria-live="polite"
                    className="fixed z-50 space-y-3 rounded-xl border border-line-strong bg-panel p-3 shadow-threshold"
                    style={{
                      left: joinPopoverPosition.left,
                      top: joinPopoverPosition.top,
                      width: joinPopoverPosition.width,
                      transform: "translateY(calc(-100% - 0.5rem))"
                    }}
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-muted">Verification required</p>
                    <p className="text-xs text-muted">Verify on Portfolio to join this human-only market.</p>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/portfolio"
                        className="inline-flex h-8 items-center rounded-lg border border-line px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text"
                        onClick={() => setJoinPopoverOpen(false)}
                      >
                        Open Portfolio
                      </Link>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setJoinPopoverOpen(false)}>
                        Close
                      </Button>
                    </div>
                  </div>,
                  popoverContainer
                )
              : null}
            {market.humanOnly ? (
              <p className="text-[11px] text-muted">
                {worldIdVerified ? "World ID active for this wallet." : "Human-only market. Verification handled in Portfolio."}
              </p>
            ) : null}
          </CardContent>
        </div>
      </Card>
    </motion.article>
  );
}
