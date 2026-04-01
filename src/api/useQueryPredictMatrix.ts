import { useMemo } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchPredictMatrix } from "@/api/fetchPredictMatrix"
import type { PredictMatrixRequest } from "@/api/types/predictMatrix"

export const QUERY_KEY_PREDICT_MATRIX_PREFIX = ["fleet", "predictMatrix"] as const

export function useQueryPredictMatrix(
  body: PredictMatrixRequest | null,
  /** Bumps when dashboard filters change so each interaction hits POST /predict/matrix. */
  requestEpoch: number,
) {
  const competitorsKey = body?.competitors.length
    ? [...body.competitors].sort().join("|")
    : ""

  const queryKey = useMemo(
    () =>
      [
        ...QUERY_KEY_PREDICT_MATRIX_PREFIX,
        requestEpoch,
        body?.location ?? "",
        body?.car_category ?? "",
        body?.start_date ?? "",
        body?.end_date ?? "",
        competitorsKey,
      ] as const,
    [
      requestEpoch,
      body?.location,
      body?.car_category,
      body?.start_date,
      body?.end_date,
      competitorsKey,
    ],
  )

  return useQuery({
    queryKey,
    queryFn: () => fetchPredictMatrix(body!),
    enabled: Boolean(body && body.competitors.length > 0),
    staleTime: 0,
    retry: 1,
    placeholderData: keepPreviousData,
  })
}
