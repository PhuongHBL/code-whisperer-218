import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useQueryFleetOptions } from "@/api/useQueryFleetOptions"
import { ALL_COMPETITORS_VALUE } from "@/modules/pages/Dashboard/fleetFilterUtils"

function initialAnalysisRange(): DateRange {
  const to = new Date()
  return { from: subDays(to, 30), to }
}

const EMPTY_LIST: string[] = []

type FleetFiltersContextValue = {
  isOptionsLoading: boolean
  optionsError: Error | null
  /** API `location` — City hub */
  locations: string[]
  /** API `competitor` — compare companies */
  competitors: string[]
  /** API `car_category` — car category */
  carCategories: string[]
  /** Resolved selection (defaults to first `location` from API when unset). */
  cityHub: string
  setCityHub: (v: string) => void
  /** Resolved selection (defaults to first `car_category`). */
  carCategory: string
  setCarCategory: (v: string) => void
  /** Empty string = all competitors */
  compareCompany: string
  setCompareCompany: (v: string) => void
  /** Dashboard analysis window (inclusive start/end days). */
  analysisRange: DateRange | undefined
  setAnalysisRange: (range: DateRange | undefined) => void
  /**
   * Bumps on each user-driven filter change so consumers (e.g. POST /predict/matrix)
   * always issue a new request instead of reusing a still-“fresh” TanStack Query cache entry.
   */
  predictMatrixRequestEpoch: number
}

const FleetFiltersContext = createContext<FleetFiltersContextValue | null>(null)

export function FleetFiltersProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isError, error } = useQueryFleetOptions()
  const [cityHubOverride, setCityHubOverride] = useState<string | null>(null)
  const [carCategoryOverride, setCarCategoryOverride] = useState<string | null>(null)
  const [compareCompany, setCompareCompanyState] = useState(ALL_COMPETITORS_VALUE)
  const [analysisRange, setAnalysisRangeState] = useState<DateRange | undefined>(initialAnalysisRange)
  const [predictMatrixRequestEpoch, setPredictMatrixRequestEpoch] = useState(0)

  const bumpPredictMatrixEpoch = useCallback(() => {
    setPredictMatrixRequestEpoch((n) => n + 1)
  }, [])

  const locations = data?.location ?? EMPTY_LIST
  const competitors = data?.competitor ?? EMPTY_LIST
  const carCategories = data?.car_category ?? EMPTY_LIST

  const cityHub = useMemo(() => {
    if (cityHubOverride !== null && locations.includes(cityHubOverride)) return cityHubOverride
    return locations[0] ?? ""
  }, [cityHubOverride, locations])

  const carCategory = useMemo(() => {
    if (carCategoryOverride !== null && carCategories.includes(carCategoryOverride)) {
      return carCategoryOverride
    }
    return carCategories[0] ?? ""
  }, [carCategoryOverride, carCategories])

  const setCityHub = useCallback(
    (v: string) => {
      setCityHubOverride(v)
      bumpPredictMatrixEpoch()
    },
    [bumpPredictMatrixEpoch],
  )
  const setCarCategory = useCallback(
    (v: string) => {
      setCarCategoryOverride(v)
      bumpPredictMatrixEpoch()
    },
    [bumpPredictMatrixEpoch],
  )
  const setCompareCompany = useCallback(
    (v: string) => {
      setCompareCompanyState(v)
      bumpPredictMatrixEpoch()
    },
    [bumpPredictMatrixEpoch],
  )
  const setAnalysisRange = useCallback(
    (range: DateRange | undefined) => {
      setAnalysisRangeState(range)
      bumpPredictMatrixEpoch()
    },
    [bumpPredictMatrixEpoch],
  )

  const value = useMemo(
    () => ({
      isOptionsLoading: isLoading,
      optionsError:
        isError && error instanceof Error ? error : isError ? new Error("Failed to load options") : null,
      locations,
      competitors,
      carCategories,
      cityHub,
      setCityHub,
      carCategory,
      setCarCategory,
      compareCompany,
      setCompareCompany,
      analysisRange,
      setAnalysisRange,
      predictMatrixRequestEpoch,
    }),
    [
      isLoading,
      isError,
      error,
      locations,
      competitors,
      carCategories,
      cityHub,
      setCityHub,
      carCategory,
      setCarCategory,
      compareCompany,
      setCompareCompany,
      analysisRange,
      setAnalysisRange,
      predictMatrixRequestEpoch,
    ],
  )

  return <FleetFiltersContext.Provider value={value}>{children}</FleetFiltersContext.Provider>
}

/** @see https://github.com/ArnaudBarre/eslint-plugin-react-refresh#only-export-components */
// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useFleetFilters() {
  const ctx = useContext(FleetFiltersContext)
  if (!ctx) {
    throw new Error("useFleetFilters must be used within FleetFiltersProvider")
  }
  return ctx
}
