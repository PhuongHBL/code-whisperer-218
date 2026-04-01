import { baseFetch } from "@/api/baseFetch"
import type { FleetOptionsApiResponse, FleetOptionsPayload } from "@/api/types/fleetOptions"

export async function fetchFleetOptions(): Promise<FleetOptionsPayload> {
  const res = await baseFetch("/options", { method: "GET" })
  const json: unknown = await res.json()

  if (!res.ok) {
    const msg =
      json && typeof json === "object" && "message" in json
        ? String((json as { message?: string }).message)
        : res.statusText
    throw new Error(msg || `Request failed (${res.status})`)
  }

  const body = json as Partial<FleetOptionsApiResponse>
  if (body.status !== "ok" || !body.options) {
    throw new Error("Invalid options response")
  }

  return body.options
}
