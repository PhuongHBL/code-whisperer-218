import Col from "@/modules/common/components/Col";
import DashboardChartsSkeleton from "@/modules/pages/Dashboard/components/DashboardChartsSkeleton";
import { usePredictMatrixDashboardChart } from "@/modules/pages/Dashboard/components/usePredictMatrixDashboardChart";
import PriceTrendsChart from "@/modules/pages/Dashboard/components/PriceTrendsChart";
import PriceTrendsBarChart from "@/modules/pages/Dashboard/components/PriceTrendsBarChart";

/**
 * Single predict/matrix query + shared legend/filter state for line and bar charts.
 */
export default function DashboardPriceTrendsSection() {
  const shared = usePredictMatrixDashboardChart();
  const chartInitialLoad =
    shared.matrixBody != null && shared.isPending && shared.data === undefined;

  if (chartInitialLoad) {
    return <DashboardChartsSkeleton />;
  }

  return (
    <Col className="gap-5 md:gap-6">
      <PriceTrendsChart shared={shared} />
      <PriceTrendsBarChart shared={shared} />
    </Col>
  );
}
