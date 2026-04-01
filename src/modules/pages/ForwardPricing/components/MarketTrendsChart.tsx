import { useCallback, useRef, useState } from "react";
import Row from "@/modules/common/components/Row";
import Col from "@/modules/common/components/Col";
import Box from "@/modules/common/components/Box";
import TextPrimary from "@/modules/common/components/TextPrimary";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WINDOW_LABELS = ["T−4w", "T−3w", "T−2w", "T−1w", "Now"] as const;

const OUR_FLEET = [118, 122, 128, 135, 142.5];
const MARKET_AVG = [125, 124, 122, 121, 120];

/**
 * Max hue separation: cyan (fleet) vs violet (market) — far apart on the wheel;
 * peak uses amber so all three are visually distinct.
 */
const FLEET_STROKE = "#0e7490";
const FLEET_FILL = "#0e7490";
const MARKET_STROKE = "#6d28d9";
const PEAK_FILL = "#b45309";
const GRID_MAJOR = "hsl(var(--outline-variant) / 0.45)";
const GRID_MINOR = "hsl(var(--outline-variant) / 0.22)";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sampleSeries(values: readonly number[], t: number): number {
  const n = values.length;
  if (n === 0) return 0;
  const pos = Math.min(1, Math.max(0, t)) * (n - 1);
  const i = Math.floor(pos);
  const f = pos - i;
  if (i >= n - 1) return values[n - 1]!;
  return lerp(values[i]!, values[i + 1]!, f);
}

export default function MarketTrendsChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    t: number;
  } | null>(null);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = chartRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const t = r.width > 0 ? x / r.width : 0;
    setHover({ x, y: e.clientY - r.top, t: Math.min(1, Math.max(0, t)) });
  }, []);

  const onPointerLeave = useCallback(() => setHover(null), []);

  const labelIndex = hover
    ? Math.min(
        WINDOW_LABELS.length - 1,
        Math.round(hover.t * (WINDOW_LABELS.length - 1)),
      )
    : 0;
  const windowLabel = WINDOW_LABELS[labelIndex] ?? WINDOW_LABELS[0];

  return (
    <Box className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-md ring-1 ring-outline-variant/10">
      <Col className="p-8 h-[450px] relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="absolute right-6 top-6 z-10 inline-flex size-8 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="About this chart"
            >
              <TextPrimary
                text="info"
                className="material-symbols-outlined text-xl leading-none"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="max-w-[15rem] text-xs leading-relaxed"
          >
            Forward window benchmark vs fleet pricing. Hover the chart for demo
            values along the timeline.
          </TooltipContent>
        </Tooltip>
        {/* Horizontal grid guides (decorative; SVG draws structured grid too) */}
        <Col className="absolute inset-x-8 inset-y-12 justify-between pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              className="w-full h-0 shrink-0 border-b border-dashed"
              style={{
                borderBottomColor:
                  i === 0 || i === 4 ? GRID_MAJOR : GRID_MINOR,
                opacity: 0.9,
              }}
            />
          ))}
        </Col>
        <Col className="relative h-full w-full justify-center items-center">
          <Box
            ref={chartRef}
            className="relative h-full w-full max-w-5xl touch-none cursor-crosshair"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            role="presentation"
          >
            {hover ? (
              <div
                className="pointer-events-none absolute z-20 min-w-[11rem] rounded-lg border border-outline-variant/30 bg-popover/95 px-3 py-2 text-xs text-popover-foreground shadow-lg backdrop-blur-sm"
                style={{
                  left: hover.x,
                  top: hover.y,
                  transform: "translate(-50%, calc(-100% - 10px))",
                }}
              >
                <p className="font-semibold text-on-surface mb-2 border-b border-outline-variant/20 pb-1.5">
                  {windowLabel}
                </p>
                <ul className="space-y-2 font-mono tabular-nums text-[0.6875rem]">
                  <li className="flex items-center justify-between gap-4 rounded-md bg-cyan-950/10 pl-2 pr-2 py-1.5 ring-1 ring-cyan-800/40 dark:ring-cyan-600/35">
                    <span className="flex items-center gap-1.5 font-sans font-bold text-cyan-900 dark:text-cyan-200">
                      <span
                        className="size-2 shrink-0 rounded-full bg-cyan-800 dark:bg-cyan-500"
                        aria-hidden
                      />
                      Our fleet
                    </span>
                    <span className="text-on-surface font-semibold">
                      ${sampleSeries(OUR_FLEET, hover.t).toFixed(2)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-4 rounded-md bg-violet-950/10 pl-2 pr-2 py-1.5 ring-1 ring-violet-800/40 dark:ring-violet-600/35">
                    <span className="flex items-center gap-1.5 font-sans font-bold text-violet-900 dark:text-violet-200">
                      <span
                        className="size-2 shrink-0 rounded-full bg-violet-800 dark:bg-violet-500"
                        aria-hidden
                      />
                      Market avg
                    </span>
                    <span className="text-on-surface font-semibold">
                      ${sampleSeries(MARKET_AVG, hover.t).toFixed(2)}
                    </span>
                  </li>
                </ul>
              </div>
            ) : null}
            <svg
              className="w-full h-full max-w-5xl overflow-visible"
              viewBox="0 0 1000 250"
              aria-label="Market pricing trends"
            >
              <title>Our fleet pricing compared to market benchmark</title>
              <defs>
                <linearGradient
                  id="gradient-forward"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={FLEET_FILL} stopOpacity="0.22" />
                  <stop
                    offset="55%"
                    stopColor={FLEET_FILL}
                    stopOpacity="0.06"
                  />
                  <stop offset="100%" stopColor={FLEET_FILL} stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Vertical time guides */}
              {[0, 250, 500, 750, 1000].map((vx) => (
                <line
                  key={vx}
                  x1={vx}
                  y1={20}
                  x2={vx}
                  y2={230}
                  stroke="hsl(var(--outline-variant))"
                  strokeWidth={1}
                  strokeDasharray="4 6"
                  opacity={0.35}
                />
              ))}
              <path
                d="M0,180 Q100,150 200,190 T400,120 T600,170 T800,80 T1000,110"
                fill="url(#gradient-forward)"
                stroke="none"
              />
              <path
                d="M0,180 Q100,150 200,190 T400,120 T600,170 T800,80 T1000,110"
                fill="none"
                stroke={FLEET_STROKE}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
              />
              <path
                d="M0,200 Q100,170 200,210 T400,140 T600,190 T800,100 T1000,130"
                fill="none"
                stroke={MARKET_STROKE}
                strokeDasharray="10 6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3.5}
              />
              <circle
                cx="800"
                cy="80"
                r={8}
                fill="white"
                className="dark:fill-surface-container-lowest"
              />
              <circle
                className="animate-pulse"
                cx="800"
                cy="80"
                fill={PEAK_FILL}
                r={5}
              />
              <text
                className="text-[11px] font-black"
                fill={PEAK_FILL}
                x="814"
                y="74"
              >
                $142.50 peak
              </text>
              {WINDOW_LABELS.map((label, i) => {
                const x = (i / (WINDOW_LABELS.length - 1)) * 1000;
                return (
                  <text
                    key={label}
                    className="text-[9px] font-bold"
                    style={{ fill: "hsl(var(--on-surface-variant) / 0.78)" }}
                    textAnchor={
                      i === 0
                        ? "start"
                        : i === WINDOW_LABELS.length - 1
                          ? "end"
                          : "middle"
                    }
                    x={i === 0 ? 4 : i === WINDOW_LABELS.length - 1 ? 996 : x}
                    y="244"
                  >
                    {label}
                  </text>
                );
              })}
            </svg>
          </Box>
          <Row className="flex-wrap gap-4 md:gap-10 mt-10 justify-center">
            <Row className="items-center gap-3 rounded-xl bg-cyan-950/12 px-4 py-2.5 ring-1 ring-cyan-800/45 dark:ring-cyan-700/40">
              <Box
                className="h-1 w-8 rounded-full shrink-0"
                style={{ backgroundColor: FLEET_STROKE }}
              />
              <Col className="gap-0">
                <TextPrimary
                  text="Our Fleet Pricing"
                  className="text-xs font-black text-cyan-950 dark:text-cyan-100"
                />
                <span className="text-[0.5625rem] font-semibold uppercase tracking-wider text-cyan-900/90 dark:text-cyan-300/90">
                  Solid line · area
                </span>
              </Col>
            </Row>
            <Row className="items-center gap-3 rounded-xl bg-violet-950/12 px-4 py-2.5 ring-1 ring-violet-800/45 dark:ring-violet-700/40">
              <Box
                className="h-1 w-10 shrink-0 rounded-full"
                style={{
                  background: `repeating-linear-gradient(90deg, ${MARKET_STROKE} 0 5px, transparent 5px 11px)`,
                }}
                aria-hidden
              />
              <Col className="gap-0">
                <TextPrimary
                  text="Market Benchmark Avg"
                  className="text-xs font-black text-violet-950 dark:text-violet-100"
                />
                <span className="text-[0.5625rem] font-semibold uppercase tracking-wider text-violet-900/90 dark:text-violet-300/90">
                  Dashed line
                </span>
              </Col>
            </Row>
          </Row>
        </Col>
      </Col>
    </Box>
  );
}
