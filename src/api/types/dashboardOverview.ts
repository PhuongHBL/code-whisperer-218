/** `POST /dashboard/overview` — see `src/docs/apiResponse/dashboardOverview.md`. */

export interface DashboardOverviewRequest {
  location: string
  car_category: string
  pickup_date: string
  rental_duration: number
  calendar_days: number
}

export interface DashboardOverviewSummaryRate {
  price: number
  competitor: string
}

export interface DashboardOverviewSummary {
  avg_daily_rate: number
  lowest_rate: DashboardOverviewSummaryRate
  highest_rate: DashboardOverviewSummaryRate
  competitor_count: number
  /** Present in current overview API; optional for older responses. */
  total_vehicles_analyzed?: number
  top_demand_hub?: string
}

export interface DashboardOverviewCalendarDay {
  date: string
  is_selected: boolean
  cheapest_price: number
  cheapest_company: string
  /** Present in current overview API; optional for older payloads. */
  highest_price?: number
  highest_company?: string
  our_suggested_price: number
  vs_cheapest_pct: number
  /** Public holiday name(s) for this date — string, array, or omitted. */
  public_holidays?: string[] | string | null
}

export interface DashboardOverviewCompetitorConfidence {
  interval: { low: number; high: number }
  interval_width: number
  confidence_score: number
  confidence_label: string
}

/** Row in `competitors[]` — see `src/docs/apiResponse/dashboardOverview.md`. */
export interface DashboardOverviewCompetitor {
  channel?: string
  competitor: string
  category?: string
  location?: string
  date?: string
  price_per_day: number
  total_rate: number
  confidence: DashboardOverviewCompetitorConfidence
}

/** `response.context` — see `src/docs/apiResponse/dashboardOverview.md`. */
export interface DashboardOverviewWeather {
  source: string
  temp_max_c: number
  precip_mm: number
  condition: string
  condition_type: string | null
  season: string | null
  summary: string
}

export interface DashboardOverviewEventItem {
  name: string
  category: string
  date: string
  venue: string
  expected_impact: string | null
  source: string | null
  url: string | null
}

export interface DashboardOverviewEventsBlock {
  count: number
  impact_level: string
  summary: string
  sources: Record<string, number>
  events: DashboardOverviewEventItem[]
}

/** `context.public_holidays[]` — see `src/docs/apiResponse/dashboardOverview.md`. */
export interface DashboardOverviewPublicHoliday {
  date: string
  name: string
}

export interface DashboardOverviewContext {
  weather: DashboardOverviewWeather
  events: DashboardOverviewEventsBlock
  demand_drivers: string[]
  public_holidays?: DashboardOverviewPublicHoliday[]
}

export interface DashboardOverviewResponse {
  location: string
  car_category: string
  pickup_date: string
  rental_duration: number
  currency: string
  model_used: string
  summary: DashboardOverviewSummary
  calendar: DashboardOverviewCalendarDay[]
  competitors: DashboardOverviewCompetitor[]
  context?: DashboardOverviewContext
  /** Some API builds return holidays at root; merged with `context.public_holidays` in the UI. */
  public_holidays?: DashboardOverviewPublicHoliday[]
}
