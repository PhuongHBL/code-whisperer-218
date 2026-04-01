import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import { Skeleton } from "@/components/ui/skeleton"

/** Placeholder while POST /predict/matrix is loading (first response). */
export default function DashboardChartsSkeleton() {
  return (
    <Col className="gap-5 md:gap-6" aria-busy="true" aria-label="Loading price charts">
      <Col className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5 overflow-hidden">
        <Col className="p-3 md:p-4 lg:p-5 border-b border-outline-variant/10 gap-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-64 max-w-full" />
          <Row className="flex-wrap gap-2 pt-1">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-full" />
          </Row>
        </Col>
        <Skeleton className="h-[min(20rem,50vh)] w-full rounded-none" />
      </Col>
      <Col className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5 overflow-hidden">
        <Col className="p-3 md:p-4 lg:p-5 border-b border-outline-variant/10 gap-3">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-56 max-w-full" />
        </Col>
        <Skeleton className="h-[min(22rem,55vh)] w-full rounded-none" />
      </Col>
    </Col>
  )
}
