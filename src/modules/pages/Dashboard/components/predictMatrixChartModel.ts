import { format, parseISO } from "date-fns"
import type { PredictMatrixResponse } from "@/api/types/predictMatrix"

export type ChartSeries = {
  id: string
  label: string
  values: number[]
  stroke: string
  strokeWidth: number
  strokeDasharray?: string
}

export type PredictMatrixChartModel = {
  dates: string[]
  /** Short labels for axis (same length as dates). */
  shortLabels: string[]
  series: ChartSeries[]
  yMin: number
  yMax: number
}

const COMPETITOR_STROKES = [
  "hsl(var(--secondary))",
  "hsl(30,89%,67%)",
  "hsl(var(--primary-container))",
  "hsl(280, 48%, 58%)",
  "hsl(160, 45%, 42%)",
  "hsl(340, 55%, 52%)",
] as const

function finiteValues(matrix: Record<string, number[]>): number[] {
  const out: number[] = []
  for (const arr of Object.values(matrix)) {
    for (const v of arr) {
      if (Number.isFinite(v)) out.push(v)
    }
  }
  return out
}

/** Ordered competitor keys: prefer API `competitors` order; include any extra matrix keys. */
function orderedCompetitorKeys(res: PredictMatrixResponse): string[] {
  const matrix = res.matrix
  const fromApi = res.competitors.filter((c) => matrix[c]?.length)
  const rest = Object.keys(matrix).filter((k) => !fromApi.includes(k))
  return [...fromApi, ...rest]
}

export function buildPredictMatrixChartModel(res: PredictMatrixResponse | undefined): PredictMatrixChartModel | null {
  if (!res?.matrix || typeof res.matrix !== "object") return null

  const keys = orderedCompetitorKeys(res)
  if (keys.length === 0) return null

  const dateSet = new Set<string>()
  for (const k of keys) {
    for (const p of res.matrix[k] ?? []) {
      dateSet.add(p.date)
    }
  }
  const dates = [...dateSet].sort()
  if (dates.length === 0) return null

  const byCompetitor: Record<string, number[]> = {}
  for (const k of keys) {
    const m = new Map((res.matrix[k] ?? []).map((p) => [p.date, p.predicted_price]))
    byCompetitor[k] = dates.map((d) => m.get(d) ?? Number.NaN)
  }

  const signal: number[] = dates.map((_, i) => {
    const vals = keys.map((k) => byCompetitor[k]![i]).filter((v) => Number.isFinite(v))
    if (vals.length === 0) return Number.NaN
    return vals.reduce((a, b) => a + b, 0) / vals.length
  })

  const shortLabels = dates.map((d) => {
    try {
      return format(parseISO(d), "MMM d")
    } catch {
      return d
    }
  })

  const competitorFinite = finiteValues(byCompetitor)
  const signalFinite = signal.filter(Number.isFinite)
  const allFinite =
    keys.length > 1 ? [...competitorFinite, ...signalFinite] : competitorFinite
  const yMin = allFinite.length ? Math.min(...allFinite) : 0
  const yMax = allFinite.length ? Math.max(...allFinite, yMin + 1) : 1

  const competitorSeries: ChartSeries[] = keys.map((k, i) => ({
    id: k,
    label: k,
    values: byCompetitor[k]!,
    stroke: COMPETITOR_STROKES[i % COMPETITOR_STROKES.length]!,
    strokeWidth: 2.5,
    strokeDasharray: i === 0 ? "8 5" : undefined,
  }))

  const series: ChartSeries[] =
    keys.length > 1
      ? [
          {
            id: "signal",
            label: "Signal",
            values: signal,
            stroke: "hsl(var(--primary))",
            strokeWidth: 5,
          },
          ...competitorSeries,
        ]
      : competitorSeries.map((s, i) =>
          i === 0
            ? { ...s, stroke: "hsl(var(--primary))", strokeWidth: 5, strokeDasharray: undefined }
            : s,
        )

  return { dates, shortLabels, series, yMin, yMax }
}
