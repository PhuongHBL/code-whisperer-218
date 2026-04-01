import { useCallback, useState } from "react"
import { format } from "date-fns"
import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import BaseButton from "@/modules/common/components/BaseButton"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useFleetFilters } from "@/modules/pages/Dashboard/FleetFiltersContext"
import type { DateRange } from "react-day-picker"

function formatAnalysisRangeLabel(range: DateRange | undefined): string {
  if (!range?.from) return "Select dates"
  if (!range.to) return `${format(range.from, "MMM d")} – …`
  const sameYear = range.from.getFullYear() === range.to.getFullYear()
  if (sameYear) {
    if (range.from.getMonth() === range.to.getMonth()) {
      return `${format(range.from, "MMM d")} – ${format(range.to, "d, yyyy")}`
    }
    return `${format(range.from, "MMM d")} – ${format(range.to, "MMM d, yyyy")}`
  }
  return `${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`
}

export default function HeroHeader() {
  const {
    isOptionsLoading,
    optionsError,
    locations,
    carCategories,
    cityHub,
    setCityHub,
    carCategory,
    setCarCategory,
    analysisRange,
    setAnalysisRange,
  } = useFleetFilters()

  const [calendarMonth, setCalendarMonth] = useState<Date>(
    () => analysisRange?.from ?? analysisRange?.to ?? new Date(),
  )

  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setCalendarMonth(analysisRange?.from ?? analysisRange?.to ?? new Date())
      }
    },
    [analysisRange?.from, analysisRange?.to],
  )

  return (
    <Box className="px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-14 bg-surface-container-low">
      <Row className="max-w-7xl mx-auto flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10">
        <Col className="gap-2 flex-1">
          {/* Breadcrumb */}
          <Row className="items-center gap-2 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">
            <TextPrimary text="Intelligence" className="" />
            <span className="material-symbols-outlined text-[0.75rem]">arrow_forward</span>
            <TextPrimary text="Analytics" className="text-primary" />
          </Row>
          <TextPrimary
            text="Price Analytics Dashboard"
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-black tracking-tighter text-primary leading-tight"
          />
          <TextPrimary
            text="Real-time market volatility and competitor positioning across ANZ regional hubs."
            className="text-on-surface-variant max-w-lg text-sm md:text-[0.9375rem]"
          />
          {optionsError ? (
            <TextPrimary
              text={optionsError.message}
              className="text-xs text-destructive max-w-lg"
            />
          ) : null}
        </Col>

        {/* Filters bar — API: location → City hub, car_category → Car category */}
        <Row className="items-center gap-0 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/10 shrink-0 flex-wrap lg:flex-nowrap">
          <Col className="px-4 py-3 border-r border-outline-variant/15 min-w-[130px]">
            <TextPrimary text="City Hub" className="text-[0.5625rem] uppercase tracking-wider font-bold text-on-surface-variant/60" />
            <Row className="items-center gap-1">
              <select
                className="bg-transparent border-none p-0 text-sm font-semibold text-primary focus:ring-0 cursor-pointer outline-none max-w-[10rem] truncate disabled:opacity-50"
                disabled={isOptionsLoading || locations.length === 0}
                value={cityHub}
                onChange={(e) => setCityHub(e.target.value)}
                aria-label="City hub"
              >
                {isOptionsLoading && locations.length === 0 ? (
                  <option value="">Loading…</option>
                ) : null}
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </Row>
          </Col>
          <Col className="px-4 py-3 border-r border-outline-variant/15 min-w-[130px]">
            <TextPrimary text="Car Category" className="text-[0.5625rem] uppercase tracking-wider font-bold text-on-surface-variant/60" />
            <Row className="items-center gap-1">
              <select
                className="bg-transparent border-none p-0 text-sm font-semibold text-primary focus:ring-0 cursor-pointer outline-none max-w-[10rem] truncate disabled:opacity-50"
                disabled={isOptionsLoading || carCategories.length === 0}
                value={carCategory}
                onChange={(e) => setCarCategory(e.target.value)}
                aria-label="Car category"
              >
                {isOptionsLoading && carCategories.length === 0 ? (
                  <option value="">Loading…</option>
                ) : null}
                {carCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </Row>
          </Col>
          <Col className="px-4 py-3 border-r border-outline-variant/15 min-w-[150px]">
            <TextPrimary text="Analysis Window" className="text-[0.5625rem] uppercase tracking-wider font-bold text-on-surface-variant/60" />
            <Popover onOpenChange={handlePopoverOpenChange}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-2 bg-transparent border-none p-0 text-left",
                    "text-sm font-semibold text-primary cursor-pointer outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 rounded-sm",
                    "disabled:opacity-50 max-w-[11rem] truncate",
                  )}
                  aria-label="Analysis date range"
                >
                  <span className="material-symbols-outlined text-sm text-on-surface-variant shrink-0">calendar_month</span>
                  <span className="truncate">{formatAnalysisRangeLabel(analysisRange)}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  selected={analysisRange}
                  onSelect={setAnalysisRange}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </Col>
          <BaseButton variant="filled" size="sm" className="m-2 p-3 rounded-lg">
            <TextPrimary text="tune" className="material-symbols-outlined block" />
          </BaseButton>
        </Row>
      </Row>
    </Box>
  )
}
