import { useCallback, useRef, useState } from "react"
import Row from "@/modules/common/components/Row"
import Col from "@/modules/common/components/Col"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const WINDOW_LABELS = ["T−4w", "T−3w", "T−2w", "T−1w", "Now"] as const

const OUR_FLEET = [118, 122, 128, 135, 142.5]
const MARKET_AVG = [125, 124, 122, 121, 120]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function sampleSeries(values: readonly number[], t: number): number {
  const n = values.length
  if (n === 0) return 0
  const pos = Math.min(1, Math.max(0, t)) * (n - 1)
  const i = Math.floor(pos)
  const f = pos - i
  if (i >= n - 1) return values[n - 1]!
  return lerp(values[i]!, values[i + 1]!, f)
}

export default function MarketTrendsChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<{ x: number; y: number; t: number } | null>(null)

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = chartRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const t = r.width > 0 ? x / r.width : 0
    setHover({ x, y: e.clientY - r.top, t: Math.min(1, Math.max(0, t)) })
  }, [])

  const onPointerLeave = useCallback(() => setHover(null), [])

  const labelIndex = hover
    ? Math.min(WINDOW_LABELS.length - 1, Math.round(hover.t * (WINDOW_LABELS.length - 1)))
    : 0
  const windowLabel = WINDOW_LABELS[labelIndex] ?? WINDOW_LABELS[0]

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
              <TextPrimary text="info" className="material-symbols-outlined text-xl leading-none" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-[15rem] text-xs leading-relaxed">
            Forward window benchmark vs fleet pricing. Hover the chart for demo values along the timeline.
          </TooltipContent>
        </Tooltip>
        {/* Grid lines */}
        <Col className="absolute inset-x-8 inset-y-12 justify-between opacity-10 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <Box key={i} className="w-full border-b border-primary/20 h-px" />
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
                <p className="font-semibold text-primary mb-1.5">{windowLabel}</p>
                <ul className="space-y-1 font-mono tabular-nums text-[0.6875rem] text-on-surface-variant">
                  <li className="flex justify-between gap-4">
                    <span className="text-primary">Our fleet</span>
                    <span>${sampleSeries(OUR_FLEET, hover.t).toFixed(2)}</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-secondary">Market avg</span>
                    <span>${sampleSeries(MARKET_AVG, hover.t).toFixed(2)}</span>
                  </li>
                </ul>
              </div>
            ) : null}
            <svg className="w-full h-full max-w-5xl overflow-visible" viewBox="0 0 1000 250" aria-label="Market pricing trends">
              <title>Our fleet pricing compared to market benchmark</title>
              <defs>
                <linearGradient id="gradient-forward" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary-container))" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="hsl(var(--primary-container))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,180 Q100,150 200,190 T400,120 T600,170 T800,80 T1000,110" fill="url(#gradient-forward)" stroke="none" />
              <path d="M0,180 Q100,150 200,190 T400,120 T600,170 T800,80 T1000,110" fill="none" stroke="hsl(var(--primary-container))" strokeLinecap="round" strokeWidth="4" />
              <path d="M0,200 Q100,170 200,210 T400,140 T600,190 T800,100 T1000,130" fill="none" stroke="hsl(var(--secondary))" strokeDasharray="8 4" strokeLinecap="round" strokeWidth="2" />
              <circle className="animate-pulse" cx="800" cy="80" fill="hsl(var(--primary-container))" r="6" />
              <text className="text-[12px] font-black" fill="hsl(var(--primary))" x="810" y="70">$142.50 Peak</text>
            </svg>
          </Box>
          <Row className="gap-12 mt-12">
            <Row className="items-center gap-3 bg-primary/5 px-4 py-2 rounded-full">
              <Box className="w-3 h-3 bg-primary rounded-full" />
              <TextPrimary text="Our Fleet Pricing" className="text-xs font-bold text-primary" />
            </Row>
            <Row className="items-center gap-3 bg-secondary/5 px-4 py-2 rounded-full">
              <Box className="w-3 h-3 bg-secondary rounded-full" />
              <TextPrimary text="Market Benchmark Avg" className="text-xs font-bold text-secondary" />
            </Row>
          </Row>
        </Col>
      </Col>
    </Box>
  )
}
