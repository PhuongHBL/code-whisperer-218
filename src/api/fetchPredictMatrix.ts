import { baseFetch } from "@/api/baseFetch"
import type { PredictMatrixRequest, PredictMatrixResponse } from "@/api/types/predictMatrix"

export async function fetchPredictMatrix(body: PredictMatrixRequest): Promise<PredictMatrixResponse> {
  const res = await baseFetch("/predict/matrix", {
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

  if (!json || typeof json !== "object" || !("matrix" in json)) {
    throw new Error("Invalid predict matrix response")
  }

  return json as PredictMatrixResponse
}
