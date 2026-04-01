import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import Col from "@/modules/common/components/Col";
import Row from "@/modules/common/components/Row";
import Box from "@/modules/common/components/Box";
import TextPrimary from "@/modules/common/components/TextPrimary";
import TopNavBar from "@/modules/pages/Dashboard/components/TopNavBar";
import SummaryCards from "./components/SummaryCards";
import OverviewContextPanel from "./components/OverviewContextPanel";
import ForwardPricingPageSkeleton from "./components/ForwardPricingPageSkeleton";
import SearchFilters, {
  type ForwardPricingFilterValues,
} from "./components/SearchFilters";
import PriceCalendar from "./components/PriceCalendar";
import CompetitorsTable from "./components/CompetitorsTable";
import { useQueryFleetOptions } from "@/api/useQueryFleetOptions";
import { useQueryDashboardOverview } from "@/api/useQueryDashboardOverview";
import type { DashboardOverviewRequest } from "@/api/types/dashboardOverview";

/** Sent on every overview request; UI control was removed but API still expects it. */
const DEFAULT_CALENDAR_DAYS = 7;

const INVALID_FILTER_TOKENS = new Set([
  "Loading…",
  "—",
  "No locations",
  "No categories",
]);

function buildOverviewBody(
  values: ForwardPricingFilterValues,
): DashboardOverviewRequest | null {
  const rental = Number.parseInt(values.rentalDuration, 10);
  if (
    !values.location ||
    !values.carCategory ||
    !values.pickupDate ||
    INVALID_FILTER_TOKENS.has(values.location) ||
    INVALID_FILTER_TOKENS.has(values.carCategory) ||
    !Number.isFinite(rental) ||
    rental < 1
  ) {
    return null;
  }
  return {
    location: values.location,
    car_category: values.carCategory,
    pickup_date: values.pickupDate,
    rental_duration: rental,
    calendar_days: DEFAULT_CALENDAR_DAYS,
  };
}

export default function ForwardPricingScreen() {
  const { user, signOut } = useAuth();
  const { data: fleetOptions, isLoading: isFleetOptionsLoading } =
    useQueryFleetOptions();

  const [filterValues, setFilterValues] = useState<ForwardPricingFilterValues>(
    () => ({
      location: "",
      carCategory: "",
      pickupDate: format(new Date(), "yyyy-MM-dd"),
      rentalDuration: "",
    }),
  );

  useEffect(() => {
    if (!fleetOptions) return;
    setFilterValues((v) => ({
      ...v,
      location: v.location || fleetOptions.location[0] || "",
      carCategory: v.carCategory || fleetOptions.car_category[0] || "",
      rentalDuration:
        v.rentalDuration ||
        (() => {
          const r = fleetOptions.rental_duration;
          if (!r) return "3";
          const def = r.default;
          if (def != null && def >= r.min && def <= r.max) return String(def);
          return String(r.min ?? 3);
        })(),
    }));
  }, [fleetOptions]);

  const overviewBody = useMemo(
    () => buildOverviewBody(filterValues),
    [filterValues],
  );

  const {
    data: overviewData,
    isPending,
    isFetching,
    isPlaceholderData,
    isError,
    error,
  } = useQueryDashboardOverview(overviewBody);

  const patchFilters = (patch: Partial<ForwardPricingFilterValues>) => {
    setFilterValues((prev) => ({ ...prev, ...patch }));
  };

  const overviewRefreshing = isFetching && isPlaceholderData;
  const overviewAwaitingFirstPayload =
    overviewBody != null && isPending && overviewData === undefined;

  const marketPricingIntelLabel = "Consumer Price Intelligence";

  return (
    <Col className="min-h-screen bg-surface text-on-surface">
      <>
        <TopNavBar user={user ?? null} onSignOut={signOut} />
        <Box className="min-h-screen">
          <Col className="p-4 md:p-8 pt-4 md:pt-6 gap-5 md:gap-6 max-w-[1400px] mx-auto w-full">
              <Row className="flex-col md:flex-row justify-between md:items-end gap-4">
                <Col className="gap-0.5">
                  <Row className="items-center gap-1.5 text-[0.5625rem] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-0.5">
                    <TextPrimary text="Intelligence" className="" />
                    <TextPrimary
                      text="chevron_right"
                      className="material-symbols-outlined text-[0.625rem]"
                    />
                    <TextPrimary
                      text={marketPricingIntelLabel}
                      className="text-primary"
                    />
                  </Row>
                  <TextPrimary
                    text={marketPricingIntelLabel}
                    className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter text-primary"
                  />
                  <TextPrimary
                    text="Comprehensive competitor rate monitoring and market volatility analysis."
                    className="text-xs text-on-surface-variant max-w-xl leading-relaxed"
                  />
                  {isError && error instanceof Error ? (
                    <TextPrimary
                      text={error.message}
                      className="text-xs text-destructive max-w-xl mt-1"
                    />
                  ) : null}
                  {overviewRefreshing ? (
                    <TextPrimary
                      text="Refreshing overview…"
                      className="text-[0.6875rem] text-on-surface-variant mt-1"
                    />
                  ) : null}
                </Col>
                {/* <BaseButton
                  type="button"
                  variant="filled"
                  size="sm"
                  className="bg-primary-container hover:opacity-95 shadow-lg shadow-primary/20 gap-1.5 self-start md:self-auto text-xs"
                  onClick={() =>
                    void queryClient.invalidateQueries({
                      queryKey: [...QUERY_KEY_DASHBOARD_OVERVIEW_PREFIX],
                    })
                  }
                >
                  <TextPrimary
                    text="analytics"
                    className="material-symbols-outlined text-xs"
                  />
                  <TextPrimary text="Refresh Monitoring" className="" />
                </BaseButton> */}
              </Row>

              {isFleetOptionsLoading ? (
                <ForwardPricingPageSkeleton variant="full" />
              ) : overviewAwaitingFirstPayload ? (
                <ForwardPricingPageSkeleton
                  variant="below-filters"
                  filterSlot={
                    <SearchFilters
                      values={filterValues}
                      onValuesChange={patchFilters}
                    />
                  }
                />
              ) : (
                <>
                  <SummaryCards overview={overviewData ?? null} />
                  <OverviewContextPanel overview={overviewData ?? null} />
                  <SearchFilters
                    values={filterValues}
                    onValuesChange={patchFilters}
                  />
                  <PriceCalendar
                    overview={overviewData ?? null}
                    pickupDate={filterValues.pickupDate}
                    onPickupDateChange={(pickupDate) =>
                      patchFilters({ pickupDate })
                    }
                  />
                  <CompetitorsTable overview={overviewData ?? null} />
                </>
              )}
            </Col>
          </Box>
      </>
    </Col>
  );
}
