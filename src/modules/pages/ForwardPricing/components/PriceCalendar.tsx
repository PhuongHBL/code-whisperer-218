import { useMemo } from "react";
import { addDays, format, parse, parseISO, subDays } from "date-fns";
import Row from "@/modules/common/components/Row";
import Col from "@/modules/common/components/Col";
import Box from "@/modules/common/components/Box";
import TextPrimary from "@/modules/common/components/TextPrimary";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  DashboardOverviewCalendarDay,
  DashboardOverviewPublicHoliday,
  DashboardOverviewResponse,
} from "@/api/types/dashboardOverview";

function currencySym(currency: string) {
  return currency === "USD" ? "$" : `${currency} `;
}

const YMD = "yyyy-MM-dd" as const;

function parseLocalYmd(ymd: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const d = parse(ymd, YMD, new Date());
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Map API / UI date strings to `yyyy-MM-dd` for lookups (calendar day vs public_holidays).
 * Handles ISO date/datetime prefix, AU `dd/MM/yyyy`, `yyyy/MM/dd`, and parseISO fallback.
 */
function normalizeDateKeyToYmd(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;

  const isoPrefix = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoPrefix) return isoPrefix[1]!;

  const dmySlash = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmySlash) {
    const dd = Number(dmySlash[1]);
    const mm = Number(dmySlash[2]);
    const yyyy = dmySlash[3]!;
    if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
      return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
    }
  }

  const ymdSlash = s.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (ymdSlash) {
    const yyyy = ymdSlash[1]!;
    const mm = Number(ymdSlash[2]);
    const dd = Number(ymdSlash[3]);
    if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
      return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
    }
  }

  try {
    const p = parse(s, "dd/MM/yyyy", new Date());
    if (!Number.isNaN(p.getTime())) return format(p, "yyyy-MM-dd");
  } catch {
    /* ignore */
  }

  try {
    const p = parseISO(s);
    if (!Number.isNaN(p.getTime())) return format(p, "yyyy-MM-dd");
  } catch {
    /* ignore */
  }

  return null;
}

function getPublicHolidaysArray(
  overview: DashboardOverviewResponse | null | undefined,
): DashboardOverviewPublicHoliday[] {
  const fromCtx = overview?.context?.public_holidays ?? [];
  const fromRoot = overview?.public_holidays ?? [];
  if (!fromCtx.length && !fromRoot.length) return [];
  if (!fromCtx.length) return fromRoot;
  if (!fromRoot.length) return fromCtx;
  return [...fromCtx, ...fromRoot];
}

function holidaysList(
  raw: DashboardOverviewCalendarDay["public_holidays"],
): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    const out: string[] = [];
    for (const el of raw as unknown[]) {
      if (el == null) continue;
      if (typeof el === "string" && el.trim()) {
        out.push(el.trim());
        continue;
      }
      if (typeof el === "object" && el !== null && "name" in el) {
        const n = (el as { name?: unknown }).name;
        if (typeof n === "string" && n.trim()) out.push(n.trim());
      }
    }
    return out;
  }
  if (typeof raw === "string" && raw.trim()) return [raw.trim()];
  return [];
}

function mergeUniqueNames(groups: string[][]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const g of groups) {
    for (const n of g) {
      const t = n.trim();
      if (!t || seen.has(t)) continue;
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

function holidayNamesByDate(
  overview: DashboardOverviewResponse | null | undefined,
): Map<string, string[]> {
  const m = new Map<string, string[]>();
  const list = getPublicHolidaysArray(overview);
  if (!list.length) return m;
  for (const h of list) {
    if (h == null || typeof h.name !== "string") continue;
    const key = normalizeDateKeyToYmd(String(h.date ?? ""));
    const name = h.name.trim();
    if (!key || !name) continue;
    const prev = m.get(key) ?? [];
    prev.push(name);
    m.set(key, prev);
  }
  return m;
}

function truncateLabel(s: string, maxChars: number): string {
  const t = s.trim();
  if (!t) return "—";
  if (t.length <= maxChars) return t;
  return `${t.slice(0, Math.max(0, maxChars - 1))}…`;
}

function priceLine(sym: string, n: number, decimals: 0 | 1 = 0): string {
  if (!Number.isFinite(n)) return `${sym}—`;
  return `${sym}${n.toFixed(decimals)}`;
}

/** If the API joins tied competitors, show only the first name in hovers. */
function firstCompanyName(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  const first = t.split(/\s*[,;|]\s*/)[0]?.trim();
  return first || t;
}

interface PriceCalendarProps {
  overview?: DashboardOverviewResponse | null;
  pickupDate: string;
  onPickupDateChange: (isoDate: string) => void;
}

export default function PriceCalendar({
  overview,
  pickupDate,
  onPickupDateChange,
}: PriceCalendarProps) {
  const currency = overview?.currency ?? "USD";
  const sym = currencySym(currency);
  const days = overview?.calendar ?? [];
  const holidaysFromContext = useMemo(
    () => holidayNamesByDate(overview),
    [overview],
  );
  const todayYmd = format(new Date(), "yyyy-MM-dd");
  const pickupYmd =
    normalizeDateKeyToYmd(pickupDate) ??
    (/^\d{4}-\d{2}-\d{2}$/.test(String(pickupDate).trim())
      ? String(pickupDate).trim()
      : pickupDate);

  const pickupLocal = parseLocalYmd(pickupDate);
  const prevYmd = pickupLocal ? format(subDays(pickupLocal, 7), YMD) : "";
  const nextYmd = pickupLocal ? format(addDays(pickupLocal, 7), YMD) : "";
  const prevDisabled = !pickupLocal || prevYmd < todayYmd;
  const nextDisabled = !pickupLocal;

  return (
    <Box className="bg-surface-container-lowest rounded-lg shadow-sm p-2 md:p-2.5 ring-1 ring-outline-variant/10">
      <Row className="items-stretch justify-between gap-1.5 md:gap-2">
        <button
          type="button"
          disabled={prevDisabled}
          className="p-1 md:p-1.5 hover:bg-surface-container-low rounded-full transition-colors shrink-0 self-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Shift pickup date 7 days earlier"
          onClick={() => {
            if (!prevDisabled && prevYmd) onPickupDateChange(prevYmd);
          }}
        >
          <TextPrimary
            text="chevron_left"
            className="material-symbols-outlined text-on-surface-variant text-lg"
          />
        </button>
        <Row className="flex-1 min-w-0 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:thin]">
          {days.length === 0 ? (
            <Col className="flex-1 min-w-full py-5 items-center justify-center min-h-[5rem]">
              <TextPrimary
                text="No calendar data — adjust filters and load overview."
                className="text-[0.6875rem] text-on-surface-variant text-center px-2"
              />
            </Col>
          ) : (
            <Row className="min-w-full justify-center">
              <Row className="gap-1.5 md:gap-2 w-max items-stretch">
            {days.map((d) => {
              const dayYmd =
                normalizeDateKeyToYmd(d.date) ??
                (/^\d{4}-\d{2}-\d{2}$/.test(String(d.date).trim())
                  ? String(d.date).trim()
                  : null);
              const isPast =
                dayYmd != null &&
                /^\d{4}-\d{2}-\d{2}$/.test(dayYmd) &&
                dayYmd < todayYmd;

              const parsedLocal =
                dayYmd != null ? parseLocalYmd(dayYmd) : null;
              const isSelected = dayYmd != null && dayYmd === pickupYmd;
              const dayLabel = parsedLocal
                ? format(parsedLocal, "EEE")
                : d.date;
              const dateLine = parsedLocal
                ? format(parsedLocal, "dd/MM/yyyy")
                : d.date;

              const hi =
                typeof d.highest_price === "number" &&
                Number.isFinite(d.highest_price)
                  ? d.highest_price
                  : null;
              const hiCo =
                typeof d.highest_company === "string"
                  ? d.highest_company.trim()
                  : "";

              const holidays = mergeUniqueNames([
                dayYmd != null
                  ? (holidaysFromContext.get(dayYmd) ?? [])
                  : [],
                holidaysList(d.public_holidays),
              ]);
              const holidayTitle = holidays.join(" · ");

              const lowPriceCls = isPast
                ? "text-on-surface-variant"
                : isSelected
                  ? "text-green-700 dark:text-green-400"
                  : "text-green-600 dark:text-green-400";
              const highPriceCls = isPast
                ? "text-on-surface-variant"
                : isSelected
                  ? "text-red-700 dark:text-red-400"
                  : "text-red-600 dark:text-red-400";

              const lowCo = d.cheapest_company?.trim() ?? "";
              const interactive = !isPast;

              const ariaPrices = `Cheapest ${priceLine(sym, d.cheapest_price, 0)} ${d.cheapest_company}. ${
                hi != null && hiCo
                  ? `Highest ${priceLine(sym, hi, 0)} ${hiCo}.`
                  : hi != null
                    ? `Highest ${priceLine(sym, hi, 0)}.`
                    : ""
              }${holidayTitle ? ` Holidays: ${holidayTitle}.` : ""}`;

              const muted = isPast
                ? "text-on-surface-variant"
                : isSelected
                  ? "text-primary font-black"
                  : "text-on-surface-variant";

              const strong = isPast
                ? "text-on-surface-variant"
                : isSelected
                  ? "text-primary font-black"
                  : "text-on-surface";

              const emitDate =
                dayYmd != null && /^\d{4}-\d{2}-\d{2}$/.test(dayYmd)
                  ? dayYmd
                  : d.date;

              return (
                <Col
                  key={dayYmd ?? d.date}
                  role={interactive ? "button" : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  aria-disabled={isPast}
                  aria-label={
                    isPast
                      ? `${dayLabel} ${dateLine}, past, not selectable`
                      : `${dayLabel} ${dateLine}. ${ariaPrices} Select as pickup.`
                  }
                  title={
                    holidayTitle ? `${dateLine}. ${holidayTitle}` : undefined
                  }
                  onClick={() => {
                    if (interactive) onPickupDateChange(emitDate);
                  }}
                  onKeyDown={(e) => {
                    if (!interactive) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onPickupDateChange(emitDate);
                    }
                  }}
                  className={`min-w-[7.25rem] sm:min-w-[7.75rem] shrink-0 rounded-lg transition-all ${
                    isPast
                      ? "opacity-45 cursor-not-allowed border border-outline-variant/10 bg-surface-container-low/60 pointer-events-none px-1.5 py-1"
                      : `cursor-pointer px-1.5 py-1.5 md:px-2 md:py-1.5 ${
                          isSelected
                            ? "relative z-[1] border border-outline-variant/25 bg-[hsl(264.67deg_5.54%_71.3%_/_40%)] shadow-md"
                            : "border border-outline-variant/25 hover:border-primary/35 bg-surface-container-lowest"
                        }`
                  }`}
                >
                  <Row className="items-baseline justify-between gap-0.5 border-b border-outline-variant/15 pb-0.5 mb-0.5">
                    <TextPrimary
                      text={dayLabel}
                      className={`text-[0.5rem] font-black uppercase tracking-tight ${muted}`}
                    />
                    <TextPrimary
                      text={dateLine}
                      className={`text-[0.5rem] font-bold tabular-nums leading-none ${strong}`}
                    />
                  </Row>

                  <Col className="gap-0.5">
                    <Row className="items-center gap-0.5 min-w-0">
                      <span
                        className={`text-[0.5rem] font-black shrink-0 w-2.5 ${
                          isPast
                            ? "text-on-surface-variant"
                            : isSelected
                              ? "text-primary/55"
                              : "text-on-surface-variant"
                        }`}
                      >
                        L
                      </span>
                      {isPast ? (
                        <span
                          className={`text-[0.5625rem] font-black tabular-nums ${lowPriceCls}`}
                        >
                          {priceLine(sym, d.cheapest_price, 0)}
                        </span>
                      ) : (
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <span
                              className={`text-[0.5625rem] font-black tabular-nums ${lowPriceCls}`}
                            >
                              {priceLine(sym, d.cheapest_price, 0)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            sideOffset={6}
                            className="max-w-[18rem] text-xs font-semibold"
                          >
                            {lowCo
                              ? `${firstCompanyName(lowCo)} · ${priceLine(sym, d.cheapest_price, 0)}`
                              : priceLine(sym, d.cheapest_price, 0)}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </Row>

                    {hi != null ? (
                      <Row className="items-center gap-0.5 min-w-0">
                        <span
                          className={`text-[0.5rem] font-black shrink-0 w-2.5 ${
                            isPast
                              ? "text-on-surface-variant"
                              : isSelected
                                ? "text-primary/55"
                                : "text-on-surface-variant"
                          }`}
                        >
                          H
                        </span>
                        {isPast ? (
                          <span
                            className={`text-[0.5625rem] font-black tabular-nums ${highPriceCls}`}
                          >
                            {priceLine(sym, hi, 0)}
                          </span>
                        ) : (
                          <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                              <span
                                className={`text-[0.5625rem] font-black tabular-nums ${highPriceCls}`}
                              >
                                {priceLine(sym, hi, 0)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={6}
                              className="max-w-[18rem] text-xs font-semibold"
                            >
                              {hiCo
                                ? `${firstCompanyName(hiCo)} · ${priceLine(sym, hi, 0)}`
                                : priceLine(sym, hi, 0)}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </Row>
                    ) : null}

                    {holidays.length > 0 ? (
                      <Row
                        className={`mt-0.5 items-start gap-0.5 min-w-0 rounded px-0.5 py-0.5 ${
                          isPast
                            ? "bg-transparent"
                            : isSelected
                              ? "bg-primary/10"
                              : "bg-amber-500/12"
                        }`}
                        title={holidayTitle}
                      >
                        <TextPrimary
                          text="celebration"
                          className={`material-symbols-outlined text-[0.625rem] shrink-0 mt-px ${
                            isPast
                              ? "text-on-surface-variant"
                              : isSelected
                                ? "text-primary/80"
                                : "text-amber-800 dark:text-amber-300"
                          }`}
                        />
                        <Col className="min-w-0 flex-1 gap-0 leading-tight">
                          {holidays.map((hn, hi) => (
                            <span
                              key={`${dayYmd ?? d.date}-${hi}-${hn}`}
                              className={`block text-[0.5rem] font-bold leading-snug break-words ${
                                isPast
                                  ? "text-on-surface-variant"
                                  : isSelected
                                    ? "text-on-surface"
                                    : "text-amber-900 dark:text-amber-200"
                              }`}
                              title={hn}
                            >
                              {truncateLabel(hn, 22)}
                            </span>
                          ))}
                        </Col>
                      </Row>
                    ) : (
                      <Row className="mt-0.5 min-w-0 px-0.5 py-0.5">
                        <span
                          className={`text-[0.5rem] font-medium leading-tight ${
                            isPast
                              ? "text-on-surface-variant/50"
                              : isSelected
                                ? "text-on-surface-variant/65"
                                : "text-on-surface-variant/55"
                          }`}
                        >
                          No public holiday
                        </span>
                      </Row>
                    )}
                  </Col>
                </Col>
              );
            })}
              </Row>
            </Row>
          )}
        </Row>
        <button
          type="button"
          disabled={nextDisabled}
          className="p-1 md:p-1.5 hover:bg-surface-container-low rounded-full transition-colors shrink-0 self-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Shift pickup date 7 days later"
          onClick={() => {
            if (!nextDisabled && nextYmd) onPickupDateChange(nextYmd);
          }}
        >
          <TextPrimary
            text="chevron_right"
            className="material-symbols-outlined text-on-surface-variant text-lg"
          />
        </button>
      </Row>
      <Box className="mt-1.5 border-t border-outline-variant/10 pt-1 text-center">
        <TextPrimary
          text="L = lowest (green) · H = highest (red) · Hover price for company · Select a day"
          className="text-[0.4375rem] md:text-[0.5rem] font-medium text-on-surface-variant/55 uppercase tracking-wider"
        />
      </Box>
    </Box>
  );
}
