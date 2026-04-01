import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useFleetFilters } from "@/modules/pages/Dashboard/FleetFiltersContext";
import { resolveCompetitorsForRequest } from "@/modules/pages/Dashboard/fleetFilterUtils";
import { useQueryPredictMatrix } from "@/api/useQueryPredictMatrix";
import type { PredictMatrixRequest } from "@/api/types/predictMatrix";
import { buildPredictMatrixChartModel } from "@/modules/pages/Dashboard/components/predictMatrixChartModel";

export function visiblePredictMatrixSeries(
  model: NonNullable<ReturnType<typeof buildPredictMatrixChartModel>>,
  signalHidden: boolean,
) {
  return model.series.filter((s) => !(s.id === "signal" && signalHidden));
}

export function usePredictMatrixDashboardChart() {
  const {
    competitors,
    compareCompanies,
    setCompareCompanies,
    carCategory,
    cityHub,
    analysisRange,
    predictMatrixRequestEpoch,
  } = useFleetFilters();

  const [signalHidden, setSignalHidden] = useState(false);

  const toggleCompareOne = useCallback(
    (name: string, nextChecked: boolean) => {
      setCompareCompanies((prev) => {
        if (prev.length === 0) {
          if (!nextChecked) return competitors.filter((c) => c !== name);
          return prev;
        }
        const next = nextChecked
          ? [...prev, name]
          : prev.filter((c) => c !== name);
        if (next.length === 0) return [];
        if (
          next.length === competitors.length &&
          competitors.every((c) => next.includes(c))
        )
          return [];
        return next;
      });
    },
    [competitors, setCompareCompanies],
  );

  const onLegendClick = useCallback(
    (seriesId: string) => {
      if (seriesId === "signal") {
        setSignalHidden((h) => !h);
        return;
      }
      const included =
        compareCompanies.length === 0 || compareCompanies.includes(seriesId);
      toggleCompareOne(seriesId, !included);
    },
    [compareCompanies, toggleCompareOne],
  );

  const matrixBody = useMemo((): PredictMatrixRequest | null => {
    if (!cityHub || !carCategory || !analysisRange?.from || !analysisRange.to)
      return null;
    const competitorList = resolveCompetitorsForRequest(
      compareCompanies,
      competitors,
    );
    if (competitorList.length === 0) return null;
    return {
      location: cityHub,
      car_category: carCategory,
      start_date: format(analysisRange.from, "yyyy-MM-dd"),
      end_date: format(analysisRange.to, "yyyy-MM-dd"),
      competitors: competitorList,
    };
  }, [
    analysisRange?.from,
    analysisRange?.to,
    carCategory,
    cityHub,
    compareCompanies,
    competitors,
  ]);

  const { data, isPending, isFetching, isPlaceholderData, isError, error } =
    useQueryPredictMatrix(matrixBody, predictMatrixRequestEpoch);

  const chartRefreshing = isFetching && isPlaceholderData;
  const model = useMemo(() => buildPredictMatrixChartModel(data), [data]);
  const currency = data?.currency ?? "USD";

  useEffect(() => {
    if (!model?.series.some((s) => s.id === "signal")) {
      setSignalHidden(false);
    }
  }, [model]);

  return {
    model,
    signalHidden,
    onLegendClick,
    data,
    currency,
    carCategory,
    isError,
    error,
    isPending,
    matrixBody,
    chartRefreshing,
  };
}

export type PredictMatrixDashboardChartContext =
  ReturnType<typeof usePredictMatrixDashboardChart>;
