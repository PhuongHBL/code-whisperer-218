import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import Col from "@/modules/common/components/Col";
import Row from "@/modules/common/components/Row";
import Box from "@/modules/common/components/Box";
import TextPrimary from "@/modules/common/components/TextPrimary";
import {
  Tooltip as InfoTooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  visiblePredictMatrixSeries,
  type PredictMatrixDashboardChartContext,
} from "@/modules/pages/Dashboard/components/usePredictMatrixDashboardChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
);

const GRID_DASH: [number, number] = [5, 6];
const GRID_COLOR = "rgba(200, 200, 200, 0.5)";
const GRID_BORDER_COLOR = "hsl(var(--outline-variant) / 0.32)";

function barFillFromStroke(stroke: string): string {
  if (stroke.startsWith("#")) {
    const hex =
      stroke.length === 4
        ? stroke
            .slice(1)
            .split("")
            .map((c) => c + c)
            .join("")
        : stroke.slice(1, 7);
    const n = Number.parseInt(hex, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r},${g},${b},0.78)`;
  }
  return stroke;
}

type Props = { shared: PredictMatrixDashboardChartContext };

export default function PriceTrendsBarChart({ shared }: Props) {
  const {
    model,
    signalHidden,
    onLegendClick,
    data,
    currency,
    carCategory,
    isError,
    error,
    isPending,
    matrixBody,
    chartRefreshing,
  } = shared;

  const chartData = useMemo(() => {
    if (!model) return null;
    const visibleSeries = visiblePredictMatrixSeries(model, signalHidden);
    if (visibleSeries.length === 0) return null;
    return {
      labels: model.shortLabels,
      datasets: visibleSeries.map((s) => ({
        label: s.label,
        data: s.values.map((v) => (Number.isFinite(v) ? v : null)) as (
          | number
          | null
        )[],
        backgroundColor: barFillFromStroke(s.stroke),
        borderColor: s.stroke,
        borderWidth: s.id === "signal" ? 2 : 1,
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 28,
      })),
    };
  }, [model, signalHidden]);

  const chartOptions = useMemo<ChartOptions<"bar">>(() => {
    if (!model) {
      return {
        responsive: true,
        maintainAspectRatio: false,
      };
    }
    const range = model.yMax - model.yMin || 1;
    const topHeadroom = range * 0.06;

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 560,
        easing: "easeInOutQuart",
      },
      interaction: {
        mode: "nearest",
        intersect: true,
      },
      datasets: {
        bar: {
          categoryPercentage: 0.72,
          barPercentage: 0.9,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "nearest",
          intersect: true,
          backgroundColor: "hsl(var(--popover) / 0.95)",
          titleColor: "hsl(var(--primary))",
          bodyColor: "hsl(var(--popover-foreground))",
          borderColor: "hsl(var(--border))",
          borderWidth: 1,
          padding: 10,
          callbacks: {
            title: (items) => {
              const i = items[0]?.dataIndex;
              if (i == null || !model.dates[i]) return "";
              try {
                return format(parseISO(model.dates[i]!), "dd/MM/yyyy");
              } catch {
                return model.shortLabels[i] ?? "";
              }
            },
            label: (ctx) => {
              const v = ctx.parsed.y;
              if (v == null || Number.isNaN(v))
                return `${ctx.dataset.label}: —`;
              const sym = currency === "USD" ? "$" : `${currency} `;
              return `${ctx.dataset.label}: ${sym}${Number(v).toFixed(0)}/d`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: false,
          grid: {
            display: true,
            color: GRID_COLOR,
            lineWidth: 1,
            drawTicks: false,
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,
            font: { size: 10, weight: 600 },
            color: "hsl(var(--on-surface-variant) / 0.55)",
          },
          border: {
            display: true,
            color: GRID_BORDER_COLOR,
            width: 1,
            dash: GRID_DASH,
            dashOffset: 0,
          },
        },
        y: {
          stacked: false,
          min: model.yMin,
          max: model.yMax + topHeadroom,
          grid: {
            display: true,
            color: GRID_COLOR,
            lineWidth: 1,
            drawTicks: false,
          },
          ticks: {
            font: { size: 10, weight: 600 },
            color: "hsl(var(--on-surface-variant) / 0.55)",
          },
          border: {
            display: true,
            color: GRID_BORDER_COLOR,
            width: 1,
            dash: GRID_DASH,
            dashOffset: 0,
          },
        },
      },
    };
  }, [model, currency]);

  const signalLineOn = !signalHidden;

  return (
    <Col className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5 overflow-hidden">
      <Col className="p-3 md:p-4 lg:p-5 border-b border-outline-variant/10 gap-3">
        <Col className="gap-0.5">
          <Row className="items-center gap-2">
            <TextPrimary
              text="Price comparison"
              className="text-base md:text-lg font-bold text-primary tracking-tight"
            />
            <InfoTooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex size-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="About this chart"
                >
                  <TextPrimary
                    text="info"
                    className="material-symbols-outlined text-lg leading-none"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[16rem] text-xs leading-relaxed"
              >
                Same data and filters as the line chart: grouped bars per day,
                one series per company plus Signal (average). Legend chips match
                the line chart — click to show, hide, or remove series from the
                comparison request.
              </TooltipContent>
            </InfoTooltip>
          </Row>
          <TextPrimary
            text={
              data
                ? `Daily predicted rates — ${data.total_days} days (${currency}) · ${carCategory || "—"}`
                : `Predicted pricing for ${carCategory || "—"}`
            }
            className="text-xs text-on-surface-variant"
          />
          {isError && error instanceof Error ? (
            <TextPrimary
              text={error.message}
              className="text-xs text-destructive max-w-lg"
            />
          ) : null}
          {isPending && matrixBody ? (
            <TextPrimary
              text="Loading predictions…"
              className="text-xs text-on-surface-variant"
            />
          ) : null}
        </Col>
        <Row
          className="flex-wrap gap-2"
          role="toolbar"
          aria-label="Bar chart series"
        >
          {model?.series.map((s) => {
            const isSignal = s.id === "signal";
            return (
              <button
                key={`bar-${s.id}`}
                type="button"
                aria-pressed={isSignal ? signalLineOn : true}
                aria-label={
                  isSignal
                    ? signalLineOn
                      ? "Hide Signal average from bar chart"
                      : "Show Signal average on bar chart"
                    : `Remove ${s.label} from comparison`
                }
                onClick={() => onLegendClick(s.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.625rem] font-bold border transition-colors cursor-pointer",
                  "focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest",
                  isSignal
                    ? signalLineOn
                      ? "bg-primary/5 text-primary border-primary/10 hover:bg-primary/10"
                      : "bg-surface-container-low/80 text-on-surface-variant/60 border-dashed border-outline-variant/35 line-through opacity-75 hover:opacity-100"
                    : "bg-surface-container-low text-on-surface border-outline-variant/20 hover:border-primary/35 hover:bg-surface-container-high/80",
                )}
              >
                <Box
                  className={cn(
                    "w-2 h-2 rounded-sm shrink-0",
                    isSignal && !signalLineOn && "opacity-35",
                  )}
                  style={{ backgroundColor: s.stroke }}
                />
                <TextPrimary text={s.label} className="" />
              </button>
            );
          })}
        </Row>
      </Col>

      <Col className="p-3 md:p-4 lg:p-5 flex-1 justify-center relative">
        {!model && !isPending ? (
          <Box className="flex items-center justify-center min-h-[16rem] text-sm text-on-surface-variant">
            <TextPrimary
              text="No chart data for the current filters."
              className=""
            />
          </Box>
        ) : null}
        <Box
          className={cn(
            "relative w-full min-h-[16rem] h-72 sm:h-80 md:h-96 lg:h-[28rem]",
            "transition-[opacity] duration-300 ease-out",
            chartRefreshing && "opacity-[0.88]",
            isPending && !chartData && "opacity-50 pointer-events-none",
          )}
        >
          {chartRefreshing ? (
            <Box
              className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-0.5 overflow-hidden rounded-full bg-outline-variant/20"
              aria-hidden
            >
              <Box className="h-full w-full rounded-full bg-primary/55 animate-pulse" />
            </Box>
          ) : null}
          {chartData ? (
            <div
              role="img"
              aria-label="Price comparison bar chart"
              className="w-full h-full"
            >
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : null}
        </Box>
      </Col>
    </Col>
  );
}
