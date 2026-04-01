import { useEffect, useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import type { DashboardOverviewResponse } from "@/api/types/dashboardOverview"

const PAGE_SIZE = 8

const EMPTY_COMPETITORS: DashboardOverviewResponse["competitors"] = []

function currencySym(currency: string) {
  return currency === "USD" ? "$" : `${currency} `
}

function initialFromName(name: string) {
  const t = name.trim()
  return t ? t[0]!.toUpperCase() : "?"
}

function formatRowDate(ymd: string | undefined): string {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return "—"
  try {
    return format(parseISO(ymd), "dd/MM/yyyy")
  } catch {
    return ymd
  }
}

function priceAmountClass(
  daily: number,
  highPrice: number | null | undefined,
  lowPrice: number | null | undefined,
): string {
  const base = "tabular-nums font-black"
  if (highPrice != null && daily >= highPrice - 1e-9)
    return `${base} text-orange-700 dark:text-orange-400 bg-orange-500/15`
  if (lowPrice != null && daily <= lowPrice + 1e-9)
    return `${base} text-emerald-700 dark:text-emerald-400 bg-emerald-500/15`
  return `${base} text-cyan-800 dark:text-cyan-300 bg-cyan-500/10`
}

function confidenceBadgeClass(label: string | undefined): string {
  const base =
    "inline-block px-1.5 py-0.5 rounded text-[0.5625rem] font-bold capitalize whitespace-nowrap border"
  const l = (label ?? "").toLowerCase().trim()
  if (l === "high")
    return `${base} bg-green-600/15 text-green-800 dark:text-green-300 border-green-600/25`
  if (l === "medium")
    return `${base} bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/25`
  if (l === "low")
    return `${base} bg-destructive/15 text-destructive border-destructive/25`
  return `${base} bg-secondary-container text-secondary-container-foreground border-transparent`
}

interface CompetitorsTableProps {
  overview?: DashboardOverviewResponse | null
}

export default function CompetitorsTable({ overview }: CompetitorsTableProps) {
  const currency = overview?.currency ?? "USD"
  const sym = currencySym(currency)
  const rows = overview?.competitors ?? EMPTY_COMPETITORS
  const highPrice = overview?.summary.highest_rate.price
  const lowPrice = overview?.summary.lowest_rate.price

  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [overview])

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [totalPages])

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return rows.slice(start, start + PAGE_SIZE)
  }, [rows, page])

  const rangeStart = rows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = rows.length === 0 ? 0 : Math.min(page * PAGE_SIZE, rows.length)

  return (
    <Box className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20 overflow-hidden">
      <Box className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="bg-surface-container-low text-[0.5625rem] font-black uppercase tracking-widest text-on-surface-variant">
              <th className="px-3 py-2 border-r border-outline-variant/10 whitespace-nowrap">Channel</th>
              <th className="px-3 py-2 border-r border-outline-variant/10 whitespace-nowrap">Company</th>
              <th className="px-3 py-2 border-r border-outline-variant/10 whitespace-nowrap">Category</th>
              <th className="px-3 py-2 border-r border-outline-variant/10 whitespace-nowrap">Date</th>
              <th className="px-3 py-2 border-r border-outline-variant/10 whitespace-nowrap">Location</th>
              <th className="px-3 py-2 border-r border-outline-variant/10 text-right whitespace-nowrap">Daily</th>
              <th className="px-3 py-2 border-r border-outline-variant/10 text-right whitespace-nowrap">Total</th>
              <th className="px-3 py-2 text-right whitespace-nowrap">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-xs text-on-surface-variant">
                  No competitor rows — load overview with valid filters.
                </td>
              </tr>
            ) : (
              pageRows.map((r, idx) => {
                const priceCls = priceAmountClass(
                  r.price_per_day,
                  highPrice,
                  lowPrice,
                )
                const globalIdx = (page - 1) * PAGE_SIZE + idx
                const key = `${r.channel ?? ""}-${r.competitor}-${r.date ?? ""}-${globalIdx}`
                const channel = r.channel?.trim() ? r.channel : "—"
                const location = r.location?.trim() ? r.location : "—"
                const conf = r.confidence
                const scorePct =
                  typeof conf.confidence_score === "number"
                    ? `${Math.round(conf.confidence_score * 100)}%`
                    : "—"

                return (
                  <tr key={key} className="hover:bg-primary-fixed/30 transition-colors">
                    <td className="px-3 py-2 text-[0.6875rem] text-on-surface-variant whitespace-nowrap">
                      {channel}
                    </td>
                    <td className="px-3 py-2">
                      <Row className="items-center gap-1.5 min-w-0">
                        <Row className="w-5 h-5 shrink-0 rounded-full bg-primary-fixed items-center justify-center text-[0.5625rem] font-bold text-primary">
                          {initialFromName(r.competitor)}
                        </Row>
                        <TextPrimary text={r.competitor} className="text-[0.6875rem] font-bold truncate" />
                      </Row>
                    </td>
                    <td className="px-3 py-2">
                      {r.category?.trim() ? (
                        <span className="inline-block px-1.5 py-0.5 bg-secondary-container/80 text-secondary-container-foreground rounded text-[0.5625rem] font-bold uppercase tracking-tight">
                          {r.category}
                        </span>
                      ) : (
                        <span className="text-[0.6875rem] text-on-surface-variant">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-[0.6875rem] tabular-nums text-on-surface-variant whitespace-nowrap">
                      {formatRowDate(r.date)}
                    </td>
                    <td className="px-3 py-2 text-[0.6875rem] text-on-surface-variant max-w-[9rem] truncate" title={location}>
                      {location}
                    </td>
                    <td className="px-3 py-2 text-right text-[0.6875rem] whitespace-nowrap">
                      <span className={`inline-block rounded-md px-2 py-0.5 ${priceCls}`}>
                        {sym}
                        {r.price_per_day.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-[0.6875rem] whitespace-nowrap">
                      <span className={`inline-block rounded-md px-2 py-0.5 ${priceCls}`}>
                        {sym}
                        {r.total_rate.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Row className="flex-col items-end gap-0.5">
                        <span className={confidenceBadgeClass(conf.confidence_label)}>
                          {conf.confidence_label}
                        </span>
                        <span
                          className="text-[0.5625rem] font-bold text-indigo-700 dark:text-indigo-300 tabular-nums"
                          title={`${sym}${conf.interval.low.toFixed(2)} – ${sym}${conf.interval.high.toFixed(2)} · width ${conf.interval_width}`}
                        >
                          {scorePct}
                        </span>
                      </Row>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </Box>
      {rows.length > 0 ? (
        <Row className="px-3 py-2 border-t border-outline-variant/10 flex-wrap gap-2 justify-between items-center bg-surface-container-low/50">
          <TextPrimary
            text={`${rangeStart}–${rangeEnd} of ${rows.length} competitor${rows.length === 1 ? "" : "s"}`}
            className="text-[0.6875rem] text-on-surface-variant font-medium tabular-nums"
          />
          {totalPages > 1 ? (
            <Row className="items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-md hover:bg-surface-container-high text-on-surface-variant disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Previous page"
              >
                <TextPrimary text="chevron_left" className="material-symbols-outlined text-base leading-none" />
              </button>
              <TextPrimary
                text={`Page ${page} / ${totalPages}`}
                className="text-[0.6875rem] font-semibold text-on-surface-variant tabular-nums px-1 min-w-[5.5rem] text-center"
              />
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-md hover:bg-surface-container-high text-on-surface-variant disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Next page"
              >
                <TextPrimary text="chevron_right" className="material-symbols-outlined text-base leading-none" />
              </button>
            </Row>
          ) : null}
        </Row>
      ) : null}
    </Box>
  )
}
