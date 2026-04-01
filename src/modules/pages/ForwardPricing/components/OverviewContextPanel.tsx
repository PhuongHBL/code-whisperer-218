import { format, parse } from "date-fns";
import Col from "@/modules/common/components/Col";
import Row from "@/modules/common/components/Row";
import Box from "@/modules/common/components/Box";
import TextPrimary from "@/modules/common/components/TextPrimary";
import { cn } from "@/lib/utils";
import type { DashboardOverviewResponse } from "@/api/types/dashboardOverview";

function weatherIcon(conditionType: string | null | undefined): string {
  const t = (conditionType ?? "").toLowerCase();
  if (t.includes("rain") || t.includes("storm")) return "rainy";
  if (t.includes("sun") || t.includes("clear")) return "wb_sunny";
  if (t.includes("fog")) return "foggy";
  if (t.includes("snow")) return "ac_unit";
  if (t.includes("cloud")) return "wb_cloudy";
  return "partly_cloudy_day";
}

function impactClass(level: string | undefined): string {
  const l = (level ?? "").toLowerCase();
  if (l === "high")
    return "bg-destructive/15 text-destructive border-destructive/25";
  if (l === "medium")
    return "bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/25";
  if (l === "low")
    return "bg-green-600/10 text-green-800 dark:text-green-300 border-green-600/20";
  return "bg-surface-container-high text-on-surface-variant border-outline-variant/30";
}

const YMD = "yyyy-MM-dd" as const;

function formatEventDate(ymd: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd;
  try {
    return format(parse(ymd, YMD, new Date()), "dd/MM/yyyy");
  } catch {
    return ymd;
  }
}

interface OverviewContextPanelProps {
  overview?: DashboardOverviewResponse | null;
}

export default function OverviewContextPanel({
  overview,
}: OverviewContextPanelProps) {
  const ctx = overview?.context;
  if (!overview || !ctx) return null;

  const { weather, events, demand_drivers } = ctx;
  const drivers = demand_drivers?.filter((d) => d.trim()) ?? [];

  return (
    <Box className="rounded-xl border border-outline-variant/15 bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-primary/5 shadow-sm overflow-hidden">
      <Row className="flex-col sm:flex-row sm:items-start sm:justify-between gap-3 px-4 py-3 md:px-5 md:py-4 border-b border-outline-variant/10 bg-surface-container-low/40">
        <Col className="gap-1">
          <Row className="items-center gap-2">
            <TextPrimary
              text="travel_explore"
              className="material-symbols-outlined text-primary text-xl"
            />
            <TextPrimary
              text="Market context"
              className="text-sm md:text-base font-black tracking-tight text-primary"
            />
          </Row>
          <TextPrimary
            text={
              overview.model_used?.trim()
                ? overview.model_used
                : "Pricing model"
            }
            className="text-[0.6875rem] text-on-surface-variant pl-8 max-w-2xl leading-snug"
          />
        </Col>
        <Box
          className={cn(
            "self-start shrink-0 px-2.5 py-1 rounded-full text-[0.5625rem] font-black uppercase tracking-wider border",
            impactClass(events.impact_level),
          )}
        >
          <TextPrimary
            text={`Demand impact: ${events.impact_level || "—"}`}
            className=""
          />
        </Box>
      </Row>

      <Row className="flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-outline-variant/10">
        {/* Weather */}
        <Col className="flex-1 p-4 md:p-5 gap-3 min-w-0">
          <Row className="items-center gap-2 text-[0.5625rem] font-black uppercase tracking-widest text-on-surface-variant flex-wrap">
            <TextPrimary
              text="wb_twilight"
              className="material-symbols-outlined text-base text-secondary"
            />
            <TextPrimary text="Weather" className="" />
            {weather.source ? (
              <TextPrimary
                text={`· ${weather.source}`}
                className="font-semibold normal-case tracking-normal text-on-surface-variant/70"
              />
            ) : null}
          </Row>
          <Row className="items-start gap-4">
            <TextPrimary
              text={weatherIcon(weather.condition_type)}
              className="material-symbols-outlined text-5xl text-primary/80 shrink-0"
            />
            <Col className="gap-1 min-w-0">
              <Row className="items-baseline gap-1">
                <TextPrimary
                  text={`${Number.isFinite(weather.temp_max_c) ? weather.temp_max_c.toFixed(0) : "—"}`}
                  className={
                    Number.isFinite(weather.temp_max_c)
                      ? "text-3xl font-black tabular-nums bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent"
                      : "text-3xl font-black tabular-nums text-on-surface-variant"
                  }
                />
                <TextPrimary
                  text="°C"
                  className="text-sm font-bold text-on-surface-variant"
                />
              </Row>
              <TextPrimary
                text={weather.condition || "—"}
                className="text-sm font-bold text-on-surface"
              />
              <TextPrimary
                text={
                  weather.summary ||
                  `${weather.condition ?? ""}${Number.isFinite(weather.precip_mm) ? `, ${weather.precip_mm}mm rain` : ""}`
                }
                className="text-[0.6875rem] text-on-surface-variant leading-relaxed"
              />
            </Col>
          </Row>
        </Col>

        {/* Events */}
        <Col className="flex-1 lg:flex-[1.35] p-4 md:p-5 gap-3 min-w-0">
          <Row className="items-center justify-between gap-2 flex-wrap">
            <Row className="items-center gap-2 text-[0.5625rem] font-black uppercase tracking-widest text-on-surface-variant">
              <TextPrimary
                text="event"
                className="material-symbols-outlined text-base text-secondary"
              />
              <TextPrimary text="Local events" className="" />
            </Row>
            {events.summary ? (
              <TextPrimary
                text={events.summary}
                className="text-[0.6875rem] font-semibold text-on-surface-variant"
              />
            ) : (
              <TextPrimary
                text={`${events.count} event${events.count === 1 ? "" : "s"}`}
                className="text-[0.6875rem] font-black text-fuchsia-700 dark:text-fuchsia-400 tabular-nums"
              />
            )}
          </Row>
          <Col className="gap-2 max-h-[220px] overflow-y-auto pr-1">
            {(events.events ?? []).length === 0 ? (
              <TextPrimary
                text="No events in this window."
                className="text-xs text-on-surface-variant italic"
              />
            ) : (
              events.events.map((ev, i) => (
                <Box
                  key={`${ev.name}-${ev.date}-${i}`}
                  className="rounded-lg border border-outline-variant/15 bg-surface-container-lowest/80 p-3 hover:border-primary/20 transition-colors"
                >
                  <Row className="items-start justify-between gap-2">
                    <Col className="gap-0.5 min-w-0 flex-1">
                      <TextPrimary
                        text={ev.name}
                        className="text-xs font-bold text-primary leading-tight"
                      />
                      <TextPrimary
                        text={`${ev.category} · ${formatEventDate(ev.date)}`}
                        className="text-[0.625rem] text-on-surface-variant"
                      />
                      <TextPrimary
                        text={ev.venue}
                        className="text-[0.625rem] text-on-surface-variant/90 line-clamp-2"
                      />
                    </Col>
                    {ev.url ? (
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 p-1.5 rounded-md text-primary hover:bg-primary/10 transition-colors"
                        aria-label={`Open details: ${ev.name}`}
                      >
                        <TextPrimary
                          text="open_in_new"
                          className="material-symbols-outlined text-lg"
                        />
                      </a>
                    ) : null}
                  </Row>
                </Box>
              ))
            )}
          </Col>
        </Col>

        {/* Demand drivers */}
        <Col className="flex-1 p-4 md:p-5 gap-3 min-w-0 lg:max-w-sm">
          <Row className="items-center gap-2 text-[0.5625rem] font-black uppercase tracking-widest text-on-surface-variant">
            <TextPrimary
              text="trending_up"
              className="material-symbols-outlined text-base text-secondary"
            />
            <TextPrimary text="Demand signals" className="" />
          </Row>
          {drivers.length === 0 ? (
            <TextPrimary
              text="No demand drivers listed."
              className="text-xs text-on-surface-variant italic"
            />
          ) : (
            <Col className="gap-2">
              {drivers.map((d, i) => (
                <Row
                  key={`${d}-${i}`}
                  className="items-start gap-2 rounded-lg bg-surface-container-low border border-outline-variant/10 px-3 py-2"
                >
                  <TextPrimary
                    text="check_circle"
                    className="material-symbols-outlined text-sm text-primary shrink-0 mt-0.5"
                  />
                  <TextPrimary
                    text={d}
                    className="text-[0.6875rem] font-medium text-on-surface leading-snug"
                  />
                </Row>
              ))}
            </Col>
          )}
        </Col>
      </Row>
    </Box>
  );
}
