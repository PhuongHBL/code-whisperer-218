import { useQuery } from "@tanstack/react-query"
import { fetchFleetOptions } from "@/api/fetchFleetOptions"

export const QUERY_KEY_FLEET_OPTIONS = ["fleet", "options"] as const

export function useQueryFleetOptions() {
  return useQuery({
    queryKey: QUERY_KEY_FLEET_OPTIONS,
    queryFn: fetchFleetOptions,
    staleTime: 60_000,
    retry: 1,
  })
}
