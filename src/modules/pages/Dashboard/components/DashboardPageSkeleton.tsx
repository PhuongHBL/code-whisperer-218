import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import { Skeleton } from "@/components/ui/skeleton"

/** Placeholder layout while fleet filter options are loading. */
export default function DashboardPageSkeleton() {
  return (
    <Col
      className="flex-1 gap-5 md:gap-6 px-2.5 md:px-4 lg:px-5 py-2 md:py-3 lg:py-4"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <Row className="flex flex-wrap items-center gap-2 md:gap-3 py-1">
        <Skeleton className="h-9 w-[9.5rem] rounded-md" />
        <Skeleton className="h-9 w-[9.5rem] rounded-md" />
        <Skeleton className="h-9 w-[11rem] rounded-md" />
        <Skeleton className="h-9 w-[12rem] rounded-md" />
        <Skeleton className="h-9 w-[10rem] rounded-md" />
      </Row>
      <Skeleton className="h-[min(22rem,55vh)] w-full rounded-xl" />
      <Skeleton className="h-[min(24rem,60vh)] w-full rounded-xl" />
    </Col>
  )
}
