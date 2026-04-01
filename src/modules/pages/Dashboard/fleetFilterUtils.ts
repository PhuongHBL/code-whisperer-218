import { useMemo } from "react"

export const ALL_COMPETITORS_VALUE = ""

/** Compare selector: optional empty value meaning all competitors. */
export function useCompareCompanyOptions(competitors: string[]) {
  return useMemo(
    () => [
      { value: ALL_COMPETITORS_VALUE, label: "All competitors" },
      ...competitors.map((c) => ({ value: c, label: c })),
    ],
    [competitors],
  )
}
