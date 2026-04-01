import { useMemo } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchDashboardOverview } from "@/api/fetchDashboardOverview"
import type { DashboardOverviewRequest } from "@/api/types/dashboardOverview"

export const QUERY_KEY_DASHBOARD_OVERVIEW_PREFIX = [
  "fleet",
  "dashboardOverview",
] as const

export function useQueryDashboardOverview(body: DashboardOverviewRequest | null) {
  const queryKey = useMemo(
    () =>
      [
        ...QUERY_KEY_DASHBOARD_OVERVIEW_PREFIX,
        body?.location ?? "",
        body?.car_category ?? "",
        body?.pickup_date ?? "",
        body?.rental_duration ?? 0,
        body?.calendar_days ?? 0,
      ] as const,
    [
      body?.calendar_days,
      body?.car_category,
      body?.location,
      body?.pickup_date,
      body?.rental_duration,
    ],
  )

  return useQuery({
    queryKey,
    queryFn: () => fetchDashboardOverview(body!),
    enabled: Boolean(body),
    staleTime: 0,
    retry: 1,
    placeholderData: keepPreviousData,
  })
}
