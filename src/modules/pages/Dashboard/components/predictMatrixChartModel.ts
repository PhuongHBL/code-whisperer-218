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

/** Thick Signal (average) line — fixed hue so it won’t match golden-angle competitor hues. */
const SIGNAL_STROKE = "#b45309"

/**
 * Golden-angle hue step (~137.5°) per competitor index so every line sits far apart on the wheel
 * (no short palette repeat → no duplicate-looking colors when many competitors).
 * Saturation/lightness jitter breaks rare near-matches for large `index`.
 */
function competitorStroke(index: number): string {
  const hue = (index * 137.508) % 360
  const sat = 68 + (index % 3) * 5
  const light = 33 + (index % 2) * 5
  return `hsl(${Math.round(hue * 100) / 100}, ${sat}%, ${light}%)`
}

/** Min/max Y from API matrix only (raw `predicted_price`), not derived series. */
function matrixPredictedPriceBounds(res: PredictMatrixResponse): {
  yMin: number
  yMax: number
} {
  const out: number[] = []
  for (const arr of Object.values(res.matrix ?? {})) {
    for (const p of arr) {
      if (Number.isFinite(p.predicted_price)) out.push(p.predicted_price)
    }
  }
  if (out.length === 0) return { yMin: 0, yMax: 1 }
  const yMin = Math.min(...out)
  const yMax = Math.max(...out)
  return { yMin, yMax }
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
      return format(parseISO(d), "dd/MM/yyyy")
    } catch {
      return d
    }
  })

  const { yMin, yMax } = matrixPredictedPriceBounds(res)

  const competitorSeries: ChartSeries[] = keys.map((k, i) => ({
    id: k,
    label: k,
    values: byCompetitor[k]!,
    stroke: competitorStroke(i),
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
            stroke: SIGNAL_STROKE,
            strokeWidth: 5,
          },
          ...competitorSeries,
        ]
      : competitorSeries.map((s, i) =>
          i === 0
            ? { ...s, stroke: SIGNAL_STROKE, strokeWidth: 5, strokeDasharray: undefined }
            : s,
        )

  return { dates, shortLabels, series, yMin, yMax }
}
