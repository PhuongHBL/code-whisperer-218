import { useCallback, useMemo, useState } from "react";
import { format, startOfToday } from "date-fns";
import Col from "@/modules/common/components/Col";
import Row from "@/modules/common/components/Row";
import Box from "@/modules/common/components/Box";
import TextPrimary from "@/modules/common/components/TextPrimary";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useFleetFilters } from "@/modules/pages/Dashboard/FleetFiltersContext";
import type { DateRange } from "react-day-picker";

function formatAnalysisRangeLabel(range: DateRange | undefined): string {
  if (!range?.from) return "Select dates";
  const d = "dd/MM/yyyy" as const;
  if (!range.to) return `${format(range.from, d)} – …`;
  return `${format(range.from, d)} – ${format(range.to, d)}`;
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
    competitors,
    compareCompanies,
    setCompareCompanies,
    analysisRange,
    setAnalysisRange,
  } = useFleetFilters();

  const compareCompaniesTriggerLabel = useMemo(() => {
    const everySelected =
      competitors.length > 0 &&
      compareCompanies.length === competitors.length &&
      competitors.every((c) => compareCompanies.includes(c));
    if (compareCompanies.length === 0 || everySelected)
      return "All competitors";
    if (compareCompanies.length === 1)
      return compareCompanies[0] ?? "1 company";
    return `${compareCompanies.length} companies`;
  }, [compareCompanies, competitors]);

  const handleCompareOne = useCallback(
    (name: string, checked: boolean) => {
      setCompareCompanies((prev) => {
        if (prev.length === 0) {
          if (!checked) return competitors.filter((c) => c !== name);
          return prev;
        }
        const next = checked ? [...prev, name] : prev.filter((c) => c !== name);
        if (next.length === 0) return [];
        if (
          next.length === competitors.length &&
          competitors.every((c) => next.includes(c))
        )
          return [];
        return next;
      });
    },
    [competitors, setCompareCompanies],
  );

  const [calendarMonth, setCalendarMonth] = useState<Date>(
    () => analysisRange?.from ?? analysisRange?.to ?? new Date(),
  );

  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setCalendarMonth(
          analysisRange?.from ?? analysisRange?.to ?? new Date(),
        );
      }
    },
    [analysisRange?.from, analysisRange?.to],
  );

  const minSelectableDay = startOfToday();

  return (
    <Box className="px-3 md:px-5 lg:px-6 py-4 md:py-5 lg:py-7 bg-surface-container-low">
      <Col className="max-w-7xl mx-auto w-full gap-3 md:gap-4">
        <Col className="gap-1.5">
          {/* Breadcrumb */}
          <Row className="items-center gap-1.5 text-[0.5625rem] font-bold uppercase tracking-widest text-on-surface-variant/60">
            <TextPrimary text="Intelligence" className="" />
            <span className="material-symbols-outlined text-[0.625rem]">
              arrow_forward
            </span>
            <TextPrimary text="Analytics" className="text-primary" />
          </Row>
          <TextPrimary
            text="Price Analytics Dashboard"
            className="text-xl md:text-2xl lg:text-[1.625rem] font-black tracking-tight text-primary leading-snug"
          />
          <TextPrimary
            text="Real-time market volatility and competitor positioning across ANZ regional hubs."
            className="text-on-surface-variant max-w-lg text-xs md:text-[0.8125rem] leading-snug"
          />
          {optionsError ? (
            <TextPrimary
              text={optionsError.message}
              className="text-[0.6875rem] text-destructive max-w-lg mt-0.5"
            />
          ) : null}
        </Col>

        {/* Filters bar — full width; equal columns on sm+ */}
        <Row className="w-full flex-col sm:flex-row items-stretch gap-0 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/10 overflow-hidden">
          <Col className="px-2.5 py-2 flex-1 min-w-0 basis-0 border-b border-outline-variant/15 sm:border-b-0 sm:border-r">
            <TextPrimary
              text="City Hub"
              className="text-[0.5rem] uppercase tracking-wider font-bold text-on-surface-variant/60 leading-tight"
            />
            <Row className="items-center gap-1 min-w-0">
              <select
                className="w-full min-w-0 bg-transparent border-none p-0 text-xs font-semibold text-primary focus:ring-0 cursor-pointer outline-none truncate disabled:opacity-50"
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
          <Col className="px-2.5 py-2 flex-1 min-w-0 basis-0 border-b border-outline-variant/15 sm:border-b-0 sm:border-r">
            <TextPrimary
              text="Car Category"
              className="text-[0.5rem] uppercase tracking-wider font-bold text-on-surface-variant/60 leading-tight"
            />
            <Row className="items-center gap-1 min-w-0">
              <select
                className="w-full min-w-0 bg-transparent border-none p-0 text-xs font-semibold text-primary focus:ring-0 cursor-pointer outline-none truncate disabled:opacity-50"
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
          <Col className="px-2.5 py-2 flex-1 min-w-0 basis-0 border-b border-outline-variant/15 sm:border-b-0 sm:border-r">
            <TextPrimary
              text="Compare Companies"
              className="text-[0.5rem] uppercase tracking-wider font-bold text-on-surface-variant/60 leading-tight"
            />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={isOptionsLoading && competitors.length === 0}
                  className={cn(
                    "flex w-full min-w-0 items-center gap-1.5 bg-transparent border-none p-0 text-left",
                    "text-xs font-semibold text-primary cursor-pointer outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 rounded-sm",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  )}
                  aria-label="Compare companies"
                  aria-haspopup="dialog"
                >
                  <span className="material-symbols-outlined text-xs text-on-surface-variant shrink-0">
                    groups
                  </span>
                  <span className="truncate min-w-0">
                    {compareCompaniesTriggerLabel}
                  </span>
                  <TextPrimary
                    text="expand_more"
                    className="material-symbols-outlined text-on-surface-variant shrink-0 text-base leading-none"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[min(100vw-2rem,18rem)] p-2"
                align="start"
              >
                <Col className="gap-0.5 max-h-[min(60vh,20rem)] overflow-y-auto">
                  <label className="flex items-center gap-2 rounded-md px-2 py-2 text-xs font-medium text-foreground hover:bg-muted/60 cursor-pointer">
                    <Checkbox
                      checked={compareCompanies.length === 0}
                      onCheckedChange={(s) => {
                        if (s === "indeterminate") return;
                        if (s === true) setCompareCompanies([]);
                        else setCompareCompanies([...competitors]);
                      }}
                    />
                    <span>All competitors</span>
                  </label>
                  <Box className="h-px bg-border my-1 shrink-0" />
                  {competitors.map((c) => {
                    const checked =
                      compareCompanies.length === 0 ||
                      compareCompanies.includes(c);
                    return (
                      <label
                        key={c}
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-xs font-medium text-foreground hover:bg-muted/60 cursor-pointer"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(s) => {
                            if (s === "indeterminate") return;
                            handleCompareOne(c, s === true);
                          }}
                        />
                        <span className="truncate">{c}</span>
                      </label>
                    );
                  })}
                </Col>
              </PopoverContent>
            </Popover>
          </Col>
          <Col className="px-2.5 py-2 flex-1 min-w-0 basis-0">
            <TextPrimary
              text="Analysis Window"
              className="text-[0.5rem] uppercase tracking-wider font-bold text-on-surface-variant/60 leading-tight"
            />
            <Popover onOpenChange={handlePopoverOpenChange}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex w-full min-w-0 items-center gap-1.5 bg-transparent border-none p-0 text-left",
                    "text-xs font-semibold text-primary cursor-pointer outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 rounded-sm",
                    "disabled:opacity-50",
                  )}
                  aria-label="Analysis date range"
                >
                  <span className="material-symbols-outlined text-xs text-on-surface-variant shrink-0">
                    calendar_month
                  </span>
                  <span className="truncate min-w-0">
                    {formatAnalysisRangeLabel(analysisRange)}
                  </span>
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
                  fromDate={minSelectableDay}
                  disabled={{ before: minSelectableDay }}
                />
              </PopoverContent>
            </Popover>
          </Col>
        </Row>
      </Col>
    </Box>
  );
}
