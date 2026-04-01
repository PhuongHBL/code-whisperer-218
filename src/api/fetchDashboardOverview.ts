import { baseFetch } from "@/api/baseFetch"
import type {
  DashboardOverviewRequest,
  DashboardOverviewResponse,
} from "@/api/types/dashboardOverview"

export async function fetchDashboardOverview(
  body: DashboardOverviewRequest,
): Promise<DashboardOverviewResponse> {
  const res = await baseFetch("/dashboard/overview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const json: unknown = await res.json()

  if (!res.ok) {
    const msg =
      json && typeof json === "object" && "message" in json
        ? String((json as { message?: string }).message)
        : res.statusText
    throw new Error(msg || `Request failed (${res.status})`)
  }

  if (
    !json ||
    typeof json !== "object" ||
    !("summary" in json) ||
    !("calendar" in json)
  ) {
    throw new Error("Invalid dashboard overview response")
  }

  return json as DashboardOverviewResponse
}
