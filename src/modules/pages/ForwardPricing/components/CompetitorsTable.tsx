import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { addDays, format, isValid, parseISO } from "date-fns";
import Row from "@/modules/common/components/Row";
import Col from "@/modules/common/components/Col";
import Box from "@/modules/common/components/Box";
import TextPrimary from "@/modules/common/components/TextPrimary";
import type {
  DashboardOverviewCompetitor,
  DashboardOverviewResponse,
} from "@/api/types/dashboardOverview";
import { coerceToYyyyMmDd } from "@/lib/coerceToYyyyMmDd";
import CompetitorsConfidenceInsight from "./CompetitorsConfidenceInsight";
import {
  confidenceBadgeClass,
  confidenceLabelTextClass,
} from "./confidenceLabelStyles";

const PAGE_SIZE = 8;

const MIN_COL_PX = 56;

const DEFAULT_COL_WIDTHS = [112, 168, 104, 118, 136, 100, 100, 148] as const;

/** Only these columns are sortable (header click). */
type SortKey = "competitor" | "daily" | "total" | "confidence";

type ColumnKey =
  | "channel"
  | "competitor"
  | "category"
  | "date"
  | "location"
  | "daily"
  | "total"
  | "confidence";

type SortDir = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  dir: SortDir;
}

const EMPTY_COMPETITORS: DashboardOverviewResponse["competitors"] = [];

function currencySym(currency: string) {
  return currency === "USD" ? "$" : `${currency} `;
}

/** Header text for price columns (currency once in thead, not per row). */
function priceColumnHeaderLabel(
  key: "daily" | "total",
  currency: string,
): string {
  const suffix = currency === "USD" ? "$" : currency;
  return key === "daily" ? `Daily (${suffix})` : `Total (${suffix})`;
}

function initialFromName(name: string) {
  const t = name.trim();
  return t ? t[0]!.toUpperCase() : "?";
}

/** Display date from overview / row values (string or number from API). */
function formatRowDate(
  raw: string | number | undefined | null,
  fallback?: string | number | null,
): string {
  const tryOne = (v: string | number | undefined | null): string | null => {
    const ymd = coerceToYyyyMmDd(v ?? null);
    if (!ymd) return null;
    const d = parseISO(ymd);
    return isValid(d) ? format(d, "dd/MM/yyyy") : null;
  };

  return tryOne(raw) ?? tryOne(fallback) ?? "—";
}

/** API may send `"DD/MM/YYYY to DD/MM/YYYY"` in one field. */
function splitCompetitorDateRange(
  raw: string | number | null | undefined,
): { from: string; to: string } | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  const m = s.match(/^(.+?)\s+to\s+(.+)$/i);
  if (!m) return null;
  const from = m[1]!.trim();
  const to = m[2]!.trim();
  if (!from || !to) return null;
  return { from, to };
}

function formatDateSegmentDisplay(seg: string): string {
  const ymd = coerceToYyyyMmDd(seg.trim());
  if (!ymd) return seg.trim();
  const d = parseISO(ymd);
  return isValid(d) ? format(d, "dd/MM/yyyy") : seg.trim();
}

/** Return date shown as pickup + rental_duration days (matches typical "to" return day). */
function rentalRangeFromPickupAndDuration(
  pickupYmd: string,
  rentalDuration: number,
): { from: string; to: string } | null {
  if (!Number.isFinite(rentalDuration) || rentalDuration < 1) return null;
  const start = parseISO(pickupYmd);
  if (!isValid(start)) return null;
  const end = addDays(start, rentalDuration);
  return {
    from: format(start, "dd/MM/yyyy"),
    to: format(end, "dd/MM/yyyy"),
  };
}

/** Pickup date from overview root or calendar when API omits `pickup_date`. */
function resolveOverviewPickupDate(
  overview: DashboardOverviewResponse | null | undefined,
): string | undefined {
  if (!overview) return undefined;
  const p = coerceToYyyyMmDd(overview.pickup_date);
  if (p) return p;
  const selected = overview.calendar?.find((d) => d.is_selected);
  const sel = coerceToYyyyMmDd(selected?.date ?? null);
  if (sel) return sel;
  return coerceToYyyyMmDd(overview.calendar?.[0]?.date ?? null) ?? undefined;
}

function firstCalendarIsoYmd(
  overview: DashboardOverviewResponse | null | undefined,
): string | null {
  for (const day of overview?.calendar ?? []) {
    const iso = coerceToYyyyMmDd(day.date);
    if (iso) return iso;
  }
  return null;
}

function compareCompetitorRows(
  a: DashboardOverviewCompetitor,
  b: DashboardOverviewCompetitor,
  key: SortKey,
  dir: SortDir,
): number {
  const m = dir === "asc" ? 1 : -1;
  let cmp = 0;
  switch (key) {
    case "competitor":
      cmp = a.competitor.localeCompare(b.competitor, undefined, {
        sensitivity: "base",
      });
      break;
    case "daily":
      cmp = a.price_per_day - b.price_per_day;
      break;
    case "total":
      cmp = a.total_rate - b.total_rate;
      break;
    case "confidence": {
      cmp =
        (a.confidence.confidence_score ?? 0) -
        (b.confidence.confidence_score ?? 0);
      if (cmp === 0) {
        cmp = (a.confidence.confidence_label ?? "").localeCompare(
          b.confidence.confidence_label ?? "",
          undefined,
          { sensitivity: "base" },
        );
      }
      break;
    }
    default:
      cmp = 0;
  }
  if (cmp !== 0) return m * cmp;
  return a.competitor.localeCompare(b.competitor, undefined, {
    sensitivity: "base",
  });
}

function priceAmountClass(
  daily: number,
  highPrice: number | null | undefined,
  lowPrice: number | null | undefined,
): string {
  const base = "tabular-nums font-black";
  if (highPrice != null && daily >= highPrice - 1e-9)
    return `${base} text-orange-700 dark:text-orange-400 bg-orange-500/15`;
  if (lowPrice != null && daily <= lowPrice + 1e-9)
    return `${base} text-emerald-700 dark:text-emerald-400 bg-emerald-500/15`;
  return `${base} text-cyan-800 dark:text-cyan-300 bg-cyan-500/10`;
}

const COLUMN_META: readonly {
  key: ColumnKey;
  label: string;
  numeric?: boolean;
  sortKey?: SortKey;
}[] = [
  { key: "channel", label: "Channel" },
  { key: "competitor", label: "Company", sortKey: "competitor" },
  { key: "category", label: "Category" },
  { key: "date", label: "From / To" },
  { key: "location", label: "Location" },
  { key: "daily", label: "Daily", numeric: true, sortKey: "daily" },
  { key: "total", label: "Total", numeric: true, sortKey: "total" },
  {
    key: "confidence",
    label: "Confidence",
    numeric: true,
    sortKey: "confidence",
  },
] as const;

function headerAriaSort(
  sort: SortConfig | null,
  sortKey: SortKey | undefined,
): "ascending" | "descending" | "none" | undefined {
  if (!sortKey) return undefined;
  if (!sort || sort.key !== sortKey) return "none";
  return sort.dir === "asc" ? "ascending" : "descending";
}

interface CompetitorsTableProps {
  overview?: DashboardOverviewResponse | null;
}

export default function CompetitorsTable({ overview }: CompetitorsTableProps) {
  const currency = overview?.currency ?? "USD";
  const sym = currencySym(currency);
  const rows = overview?.competitors ?? EMPTY_COMPETITORS;
  const defaultCompetitorDate = resolveOverviewPickupDate(overview);
  const overviewRecord = overview as Record<string, unknown> | null | undefined;
  const overviewCategory =
    overview?.car_category?.trim() ||
    (typeof overviewRecord?.carCategory === "string"
      ? overviewRecord.carCategory.trim()
      : "");
  const overviewLocation = overview?.location?.trim() ?? "";
  const highPrice = overview?.summary.highest_rate.price;
  const lowPrice = overview?.summary.lowest_rate.price;

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [colWidths, setColWidths] = useState<number[]>(() => [
    ...DEFAULT_COL_WIDTHS,
  ]);
  const colWidthsRef = useRef(colWidths);
  colWidthsRef.current = colWidths;

  const [resizing, setResizing] = useState<{
    col: number;
    startX: number;
    startW: number;
  } | null>(null);

  const [page, setPage] = useState(1);

  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows;
    const copy = [...rows];
    copy.sort((a, b) =>
      compareCompetitorRows(a, b, sortConfig.key, sortConfig.dir),
    );
    return copy;
  }, [rows, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [overview]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (!resizing) return;
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const next = Math.max(MIN_COL_PX, resizing.startW + delta);
      setColWidths((w) => {
        const n = [...w];
        n[resizing.col] = next;
        return n;
      });
    };
    const onUp = () => setResizing(null);
    const prevCursor = document.body.style.cursor;
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevUserSelect;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [resizing]);

  const toggleSort = useCallback((key: SortKey) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
    setPage(1);
  }, []);

  const startResize = useCallback((colIndex: number, e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing({
      col: colIndex,
      startX: e.clientX,
      startW: colWidthsRef.current[colIndex] ?? MIN_COL_PX,
    });
  }, []);

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedRows.slice(start, start + PAGE_SIZE);
  }, [sortedRows, page]);

  const rangeStart = sortedRows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd =
    sortedRows.length === 0 ? 0 : Math.min(page * PAGE_SIZE, sortedRows.length);

  const tableMinWidth = Math.max(
    720,
    colWidths.reduce((a, b) => a + b, 0),
  );

  return (
    <Box className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20 overflow-hidden">
      <Box className="overflow-x-auto">
        <table
          className="text-left border-collapse"
          style={{
            tableLayout: "fixed",
            width: "100%",
            minWidth: tableMinWidth,
          }}
        >
          <colgroup>
            {colWidths.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
          <thead>
            <tr className="bg-surface-container-low">
              {COLUMN_META.map((col, colIndex) => {
                const headerText =
                  col.key === "daily"
                    ? priceColumnHeaderLabel("daily", currency)
                    : col.key === "total"
                      ? priceColumnHeaderLabel("total", currency)
                      : col.label;
                return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={headerAriaSort(sortConfig, col.sortKey)}
                  className={`relative p-0 border-r border-outline-variant/10 last:border-r-0 align-bottom ${
                    col.numeric ? "text-right" : "text-left"
                  }`}
                >
                  {col.sortKey ? (
                    <button
                      type="button"
                      title={`Sort by ${headerText}`}
                      onClick={() => toggleSort(col.sortKey)}
                      className={`w-full min-w-0 flex items-center gap-1 pl-3 pr-4 py-2 text-[0.5625rem] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-highest/80 transition-colors ${
                        col.numeric ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="truncate">{headerText}</span>
                      {sortConfig?.key === col.sortKey ? (
                        <span
                          className="material-symbols-outlined text-[0.875rem] shrink-0 leading-none text-primary"
                          aria-hidden
                        >
                          {sortConfig.dir === "asc"
                            ? "arrow_upward"
                            : "arrow_downward"}
                        </span>
                      ) : null}
                    </button>
                  ) : (
                    <div
                      className={`w-full min-w-0 flex items-center gap-1 pl-3 pr-4 py-2 text-[0.5625rem] font-black uppercase tracking-widest text-on-surface-variant ${
                        col.numeric ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="truncate">{headerText}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`Resize ${headerText} column`}
                    title="Drag to resize column"
                    onMouseDown={(e) => startResize(colIndex, e)}
                    className="absolute right-0 top-0 bottom-0 z-20 w-2 cursor-col-resize select-none border-0 p-0 bg-transparent hover:bg-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
                  />
                </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {sortedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-xs text-on-surface-variant"
                >
                  No competitor rows — load overview with valid filters.
                </td>
              </tr>
            ) : (
              pageRows.map((r, idx) => {
                const priceCls = priceAmountClass(
                  r.price_per_day,
                  highPrice,
                  lowPrice,
                );
                const globalIdx = (page - 1) * PAGE_SIZE + idx;
                const key = `${r.channel ?? ""}-${r.competitor}-${r.date ?? ""}-${r.price_per_day}-${r.total_rate}-${globalIdx}`;
                const channel = r.channel?.trim() ? r.channel : "—";
                const location = r.location?.trim() ? r.location : "—";
                const conf = r.confidence;
                const scorePct =
                  typeof conf.confidence_score === "number"
                    ? `${Math.round(conf.confidence_score * 100)}%`
                    : "—";
                const microFishCategory =
                  r.category?.trim() || overviewCategory || "General";
                const microFishCompany = r.competitor?.trim() ?? "";
                const microFishLocation =
                  r.location?.trim() || overviewLocation || "Unknown";
                const dateRange = splitCompetitorDateRange(r.date);
                const microFishDate =
                  coerceToYyyyMmDd(dateRange?.from ?? null) ??
                  coerceToYyyyMmDd(r.date ?? defaultCompetitorDate) ??
                  firstCalendarIsoYmd(overview);
                const computedRentalRange =
                  !dateRange &&
                  defaultCompetitorDate &&
                  overview != null
                    ? rentalRangeFromPickupAndDuration(
                        defaultCompetitorDate,
                        overview.rental_duration,
                      )
                    : null;
                const displayDateRange = dateRange
                  ? {
                      from: formatDateSegmentDisplay(dateRange.from),
                      to: formatDateSegmentDisplay(dateRange.to),
                    }
                  : computedRentalRange;
                const microFishReady = Boolean(
                  microFishCompany && microFishDate,
                );

                return (
                  <tr
                    key={key}
                    className="hover:bg-primary-fixed/30 transition-colors"
                  >
                    <td className="px-3 py-2 text-[0.6875rem] text-on-surface-variant whitespace-nowrap">
                      {channel}
                    </td>
                    <td className="px-3 py-2">
                      <Row className="items-center gap-1.5 min-w-0">
                        <Row className="w-5 h-5 shrink-0 rounded-full bg-primary-fixed items-center justify-center text-[0.5625rem] font-bold text-primary">
                          {initialFromName(r.competitor)}
                        </Row>
                        <TextPrimary
                          text={r.competitor}
                          className="text-[0.6875rem] font-bold truncate"
                        />
                      </Row>
                    </td>
                    <td className="px-3 py-2">
                      {r.category?.trim() ? (
                        <span className="inline-block px-1.5 py-0.5 bg-secondary-container/80 text-secondary-container-foreground rounded text-[0.5625rem] font-bold uppercase tracking-tight">
                          {r.category}
                        </span>
                      ) : (
                        <span className="text-[0.6875rem] text-on-surface-variant">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-[0.6875rem] tabular-nums text-on-surface-variant align-top">
                      {displayDateRange ? (
                        <Col className="gap-0.5 min-w-0">
                          <span className="whitespace-nowrap">
                            <span className="font-semibold text-on-surface-variant/80">
                              From{" "}
                            </span>
                            {displayDateRange.from}
                          </span>
                          <span className="whitespace-nowrap">
                            <span className="font-semibold text-on-surface-variant/80">
                              To{" "}
                            </span>
                            {displayDateRange.to}
                          </span>
                        </Col>
                      ) : (
                        <span className="whitespace-nowrap">
                          {formatRowDate(r.date, defaultCompetitorDate)}
                        </span>
                      )}
                    </td>
                    <td
                      className="px-3 py-2 text-[0.6875rem] text-on-surface-variant max-w-[9rem] truncate"
                      title={location}
                    >
                      {location}
                    </td>
                    <td className="px-3 py-2 text-right text-[0.6875rem] whitespace-nowrap">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 ${priceCls}`}
                      >
                        {r.price_per_day.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right text-[0.6875rem] whitespace-nowrap">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 ${priceCls}`}
                      >
                        {r.total_rate.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Row className="flex-col items-end gap-0.5">
                        <Row className="items-center gap-0.5 justify-end">
                          <span
                            className={confidenceBadgeClass(
                              conf.confidence_label,
                            )}
                          >
                            {conf.confidence_label}
                          </span>
                          <CompetitorsConfidenceInsight
                            category={microFishCategory}
                            company={microFishCompany}
                            selectedDate={microFishDate ?? ""}
                            location={microFishLocation}
                            confidenceLabel={conf.confidence_label}
                            canRequest={microFishReady}
                          />
                        </Row>
                        <span
                          className={`text-[0.5625rem] font-bold tabular-nums ${confidenceLabelTextClass(conf.confidence_label)}`}
                          title={`${sym}${conf.interval.low.toFixed(2)} – ${sym}${conf.interval.high.toFixed(2)} · width ${conf.interval_width}`}
                        >
                          {scorePct}
                        </span>
                      </Row>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Box>
      {sortedRows.length > 0 ? (
        <Row className="px-3 py-2 border-t border-outline-variant/10 flex-wrap gap-2 justify-between items-center bg-surface-container-low/50">
          <TextPrimary
            text={`${rangeStart}–${rangeEnd} of ${sortedRows.length} competitor${sortedRows.length === 1 ? "" : "s"}`}
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
                <TextPrimary
                  text="chevron_left"
                  className="material-symbols-outlined text-base leading-none"
                />
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
                <TextPrimary
                  text="chevron_right"
                  className="material-symbols-outlined text-base leading-none"
                />
              </button>
            </Row>
          ) : null}
        </Row>
      ) : null}
    </Box>
  );
}
