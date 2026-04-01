import { useMemo } from "react"
import { format, parseISO } from "date-fns"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js"
import type { ChartOptions } from "chart.js"
import { Line } from "react-chartjs-2"
import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import BaseButton from "@/modules/common/components/BaseButton"
import { Tooltip as InfoTooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useFleetFilters } from "@/modules/pages/Dashboard/FleetFiltersContext"
import { ALL_COMPETITORS_VALUE, useCompareCompanyOptions } from "@/modules/pages/Dashboard/fleetFilterUtils"
import { useQueryPredictMatrix } from "@/api/useQueryPredictMatrix"
import type { PredictMatrixRequest } from "@/api/types/predictMatrix"
import { buildPredictMatrixChartModel } from "@/modules/pages/Dashboard/components/predictMatrixChartModel"
import { cn } from "@/lib/utils"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

const LINE_TENSION = 0.42

export default function PriceTrendsChart() {
  const {
    isOptionsLoading,
    competitors,
    compareCompany,
    setCompareCompany,
    carCategory,
    cityHub,
    analysisRange,
    predictMatrixRequestEpoch,
  } = useFleetFilters()
  const compareOptions = useCompareCompanyOptions(competitors)

  const matrixBody = useMemo((): PredictMatrixRequest | null => {
    if (!cityHub || !carCategory || !analysisRange?.from || !analysisRange.to) return null
    const competitorList =
      compareCompany === ALL_COMPETITORS_VALUE
        ? [...competitors]
        : compareCompany
          ? [compareCompany]
          : []
    if (competitorList.length === 0) return null
    return {
      location: cityHub,
      car_category: carCategory,
      start_date: format(analysisRange.from, "yyyy-MM-dd"),
      end_date: format(analysisRange.to, "yyyy-MM-dd"),
      competitors: competitorList,
    }
  }, [analysisRange?.from, analysisRange?.to, carCategory, cityHub, compareCompany, competitors])

  const { data, isPending, isError, error } = useQueryPredictMatrix(matrixBody, predictMatrixRequestEpoch)

  const model = useMemo(() => buildPredictMatrixChartModel(data), [data])
  const currency = data?.currency ?? "USD"

  const chartData = useMemo(() => {
    if (!model) return null
    return {
      labels: model.shortLabels,
      datasets: model.series.map((s) => ({
        label: s.label,
        data: s.values.map((v) => (Number.isFinite(v) ? v : null)) as (number | null)[],
        borderColor: s.stroke,
        backgroundColor: s.stroke,
        borderWidth: Math.min(Math.round(s.strokeWidth), 4),
        borderDash: s.strokeDasharray ? ([8, 5] as [number, number]) : undefined,
        tension: LINE_TENSION,
        fill: false,
        spanGaps: false,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 12,
        pointBackgroundColor: s.stroke,
        pointBorderColor: s.stroke,
        pointBorderWidth: 0,
      })),
    }
  }, [model])

  const chartOptions = useMemo<ChartOptions<"line">>(() => {
    if (!model) {
      return {
        responsive: true,
        maintainAspectRatio: false,
      }
    }
    const range = model.yMax - model.yMin || 1
    const topHeadroom = range * 0.04

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "hsl(var(--popover) / 0.95)",
          titleColor: "hsl(var(--primary))",
          bodyColor: "hsl(var(--popover-foreground))",
          borderColor: "hsl(var(--border))",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            title: (items) => {
              const i = items[0]?.dataIndex
              if (i == null || !model.dates[i]) return ""
              try {
                return format(parseISO(model.dates[i]!), "MMM d, yyyy")
              } catch {
                return model.shortLabels[i] ?? ""
              }
            },
            label: (ctx) => {
              const v = ctx.parsed.y
              if (v == null || Number.isNaN(v)) return `${ctx.dataset.label}: —`
              const sym = currency === "USD" ? "$" : `${currency} `
              return `${ctx.dataset.label}: ${sym}${Number(v).toFixed(0)}/d`
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: "hsl(var(--outline-variant) / 0.25)" },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,
            font: { size: 10, weight: 600 },
            color: "hsl(var(--on-surface-variant) / 0.55)",
          },
          border: { display: false },
        },
        y: {
          min: model.yMin,
          max: model.yMax + topHeadroom,
          grid: { color: "hsl(var(--outline-variant) / 0.25)" },
          ticks: {
            font: { size: 10, weight: 600 },
            color: "hsl(var(--on-surface-variant) / 0.55)",
          },
          border: { display: false },
        },
      },
      elements: {
        line: {
          tension: LINE_TENSION,
          borderCapStyle: "round",
          borderJoinStyle: "round",
        },
        point: {
          radius: 0,
          hoverRadius: 5,
        },
      },
    }
  }, [model, currency])

  return (
    <Col className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5 overflow-hidden">
      {/* Header */}
      <Col className="p-5 md:p-6 lg:p-8 border-b border-outline-variant/10 gap-4">
        <Row className="flex-col sm:flex-row sm:items-start justify-between gap-4">
          <Col className="gap-0.5">
            <Row className="items-center gap-2">
              <TextPrimary text="Price Trends" className="text-base md:text-lg font-bold text-primary tracking-tight" />
              <InfoTooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="About this chart"
                  >
                    <TextPrimary text="info" className="material-symbols-outlined text-lg leading-none" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[16rem] text-xs leading-relaxed">
                  Predicted daily rates from the fleet /predict/matrix API for the selected hub, category, analysis
                  window, and competitors. Hover the chart to read values by date.
                </TooltipContent>
              </InfoTooltip>
            </Row>
            <TextPrimary
              text={
                data
                  ? `Predicted pricing — ${data.total_days} days (${currency}) · ${carCategory || "—"}`
                  : `Predicted pricing for ${carCategory || "—"}`
              }
              className="text-xs text-on-surface-variant"
            />
            {isError && error instanceof Error ? (
              <TextPrimary text={error.message} className="text-xs text-destructive max-w-lg" />
            ) : null}
            {isPending && matrixBody ? (
              <TextPrimary text="Loading predictions…" className="text-xs text-on-surface-variant" />
            ) : null}
          </Col>
          <Col className="gap-1 w-full sm:w-auto sm:min-w-[12rem]">
            <TextPrimary text="Compare Companies" className="text-[0.5625rem] uppercase tracking-wider font-bold text-on-surface-variant/60 px-1" />
            <Box className="relative">
              <select
                className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-1.5 pl-3 pr-10 text-xs font-semibold text-primary appearance-none focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer disabled:opacity-50"
                disabled={isOptionsLoading && competitors.length === 0}
                value={compareCompany}
                onChange={(e) => setCompareCompany(e.target.value)}
                aria-label="Compare companies"
              >
                {compareOptions.map(({ value, label }) => (
                  <option key={value || "all"} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <TextPrimary text="expand_more" className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base" />
            </Box>
          </Col>
        </Row>
        <Row className="flex-wrap gap-2">
          {model?.series.map((s, idx) => (
            <Row
              key={s.id}
              className={
                idx === 0
                  ? "items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-[0.625rem] font-bold text-primary border border-primary/10"
                  : "items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-[0.625rem] font-bold text-on-surface-variant border border-outline-variant/20"
              }
            >
              <Box className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.stroke }} />
              <TextPrimary text={s.label} className="" />
            </Row>
          ))}
          <BaseButton variant="bordered" size="sm" className="rounded-full border-dashed border-outline-variant/40 text-[0.625rem] font-bold text-on-surface-variant px-3 py-1">
            <TextPrimary text="add" className="material-symbols-outlined text-[0.75rem]" />
            <TextPrimary text="Add More" className="" />
          </BaseButton>
        </Row>
      </Col>

      <Col className="p-5 md:p-6 lg:p-8 flex-1 justify-end min-h-[24rem] sm:min-h-[30rem] md:min-h-[34rem] lg:min-h-[40rem] relative">
        {!model && !isPending ? (
          <Box className="flex items-center justify-center min-h-[16rem] text-sm text-on-surface-variant">
            <TextPrimary text="No chart data for the current filters." className="" />
          </Box>
        ) : null}
        <Box
          className={cn(
            "relative w-full min-h-[16rem] h-72 sm:h-80 md:h-96 lg:h-[28rem]",
            isPending && "opacity-40 pointer-events-none",
          )}
        >
          {chartData ? (
            <div role="img" aria-label="Price trends comparison chart">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : null}
        </Box>
      </Col>
    </Col>
  )
}
