import Row from "@/modules/common/components/Row"
import Col from "@/modules/common/components/Col"
import TextPrimary from "@/modules/common/components/TextPrimary"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { DashboardOverviewResponse } from "@/api/types/dashboardOverview"

/** Explanations aligned with the forward-pricing dashboard API (single overview call). */
const SUMMARY_TITLE_TOOLTIPS = {
  avgDailyRate:
    "Median price across all competitors for the selected pickup date — more robust than the mean when one outlier brand skews the distribution.",
  topDemandHub:
    "Demand drivers use a rule-based list: season, weekend, public/school holidays, and events.",
  lowestRate: "Cheapest competitor prediction for this pickup date and rental duration.",
  highestRate: "Most expensive competitor prediction for this pickup date and rental duration.",
} as const

function currencySym(currency: string) {
  return currency === "USD" ? "$" : `${currency} `
}

interface StatCard {
  label: string
  /** Shown on hover/focus for the title (API field semantics). */
  titleTooltip: string
  value: string
  badge: string
  badgeColor: string
  borderColor: string
  /** Tailwind classes for the main figure */
  valueClassName: string
  /** Subtle card tint so numbers read as color-coded */
  cardBgClass: string
  badgeIsIcon?: boolean
}

const fallbackStats: StatCard[] = [
  {
    label: "Avg daily rate",
    titleTooltip: SUMMARY_TITLE_TOOLTIPS.avgDailyRate,
    value: "—",
    badge: "—",
    badgeColor: "text-on-surface-variant",
    borderColor: "border-sky-500/60",
    valueClassName: "text-sky-700 dark:text-sky-300",
    cardBgClass: "bg-gradient-to-br from-sky-500/10 via-surface-container-lowest to-surface-container-lowest",
  },
  {
    label: "Top demand hub",
    titleTooltip: SUMMARY_TITLE_TOOLTIPS.topDemandHub,
    value: "—",
    badge: "location_on",
    badgeColor: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-500/50",
    badgeIsIcon: true,
    valueClassName: "text-violet-800 dark:text-violet-300",
    cardBgClass: "bg-gradient-to-br from-violet-500/10 via-surface-container-lowest to-surface-container-lowest",
  },
  {
    label: "Lowest rate",
    titleTooltip: SUMMARY_TITLE_TOOLTIPS.lowestRate,
    value: "—",
    badge: "—",
    badgeColor: "text-on-surface-variant",
    borderColor: "border-emerald-500/55",
    valueClassName: "text-emerald-700 dark:text-emerald-400",
    cardBgClass: "bg-gradient-to-br from-emerald-500/10 via-surface-container-lowest to-surface-container-lowest",
  },
  {
    label: "Highest rate",
    titleTooltip: SUMMARY_TITLE_TOOLTIPS.highestRate,
    value: "—",
    badge: "—",
    badgeColor: "text-on-surface-variant",
    borderColor: "border-orange-500/55",
    valueClassName: "text-orange-700 dark:text-orange-400",
    cardBgClass: "bg-gradient-to-br from-orange-500/10 via-surface-container-lowest to-surface-container-lowest",
  },
]

function buildStats(overview: DashboardOverviewResponse): StatCard[] {
  const sym = currencySym(overview.currency)
  const { summary } = overview
  const hub = summary.top_demand_hub?.trim() ? summary.top_demand_hub : overview.location

  return [
    {
      label: "Avg daily rate",
      titleTooltip: SUMMARY_TITLE_TOOLTIPS.avgDailyRate,
      value: `${sym}${summary.avg_daily_rate.toFixed(2)}`,
      badge: `${summary.competitor_count} competitors`,
      badgeColor: "text-sky-800/90 dark:text-sky-300/90 font-black",
      borderColor: "border-sky-500/60",
      valueClassName: "text-sky-700 dark:text-sky-300 drop-shadow-sm",
      cardBgClass: "bg-gradient-to-br from-sky-500/10 via-surface-container-lowest to-surface-container-lowest",
    },
    {
      label: "Top demand hub",
      titleTooltip: SUMMARY_TITLE_TOOLTIPS.topDemandHub,
      value: hub,
      badge: "location_on",
      badgeColor: "text-violet-600 dark:text-violet-400",
      borderColor: "border-violet-500/50",
      valueClassName: "text-violet-800 dark:text-violet-300 drop-shadow-sm",
      cardBgClass: "bg-gradient-to-br from-violet-500/10 via-surface-container-lowest to-surface-container-lowest",
      badgeIsIcon: true,
    },
    {
      label: "Lowest rate",
      titleTooltip: SUMMARY_TITLE_TOOLTIPS.lowestRate,
      value: `${sym}${summary.lowest_rate.price.toFixed(2)}`,
      badge: summary.lowest_rate.competitor,
      badgeColor: "text-emerald-800/85 dark:text-emerald-400/90 font-bold",
      borderColor: "border-emerald-500/55",
      valueClassName: "text-emerald-700 dark:text-emerald-400 drop-shadow-sm",
      cardBgClass: "bg-gradient-to-br from-emerald-500/10 via-surface-container-lowest to-surface-container-lowest",
    },
    {
      label: "Highest rate",
      titleTooltip: SUMMARY_TITLE_TOOLTIPS.highestRate,
      value: `${sym}${summary.highest_rate.price.toFixed(2)}`,
      badge: summary.highest_rate.competitor,
      badgeColor: "text-orange-800/85 dark:text-orange-400/90 font-bold",
      borderColor: "border-orange-500/55",
      valueClassName: "text-orange-700 dark:text-orange-400 drop-shadow-sm",
      cardBgClass: "bg-gradient-to-br from-orange-500/10 via-surface-container-lowest to-surface-container-lowest",
    },
  ]
}

interface SummaryCardsProps {
  overview?: DashboardOverviewResponse | null
}

export default function SummaryCards({ overview }: SummaryCardsProps) {
  const stats = overview ? buildStats(overview) : fallbackStats

  return (
    <Row className="flex-col sm:flex-row sm:flex-wrap gap-4">
      {stats.map((s) => (
        <Col
          key={s.label}
          className={`flex-1 min-w-[180px] sm:min-w-[200px] p-4 rounded-lg shadow-sm border-l-4 ${s.borderColor} ${s.cardBgClass}`}
        >
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <span
                className="mb-0.5 inline-block max-w-full cursor-default border-b border-dotted border-on-surface-variant/40"
                tabIndex={0}
              >
                <TextPrimary
                  text={s.label}
                  className="text-[0.5625rem] font-black uppercase tracking-widest text-on-surface-variant"
                />
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="max-w-[18rem] text-xs leading-relaxed"
            >
              {s.titleTooltip}
            </TooltipContent>
          </Tooltip>
          <Row className="items-end gap-1.5">
            <TextPrimary
              text={s.value}
              className={`text-lg sm:text-xl font-black tabular-nums tracking-tight ${s.valueClassName}`}
            />
            {s.badgeIsIcon ? (
              <TextPrimary text={s.badge} className={`material-symbols-outlined text-xs mb-0.5 ${s.badgeColor}`} />
            ) : (
              <TextPrimary text={s.badge} className={`text-[0.5625rem] font-bold mb-0.5 truncate max-w-[10rem] ${s.badgeColor}`} />
            )}
          </Row>
        </Col>
      ))}
    </Row>
  )
}
