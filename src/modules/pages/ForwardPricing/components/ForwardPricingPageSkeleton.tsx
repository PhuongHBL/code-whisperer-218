import type { ReactNode } from "react"
import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import { Skeleton } from "@/components/ui/skeleton"

function SummaryAndContextSkeleton() {
  return (
    <>
      <Row className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[5.5rem] w-full rounded-xl" />
        ))}
      </Row>
      <Skeleton className="h-28 w-full rounded-lg" />
    </>
  )
}

function FilterRowSkeleton() {
  return (
    <Row className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
      <Skeleton className="h-10 w-full md:w-[14rem]" />
      <Skeleton className="h-10 w-full md:w-[14rem]" />
      <Skeleton className="h-10 w-full md:w-[11rem]" />
      <Skeleton className="h-10 w-full md:w-[9rem]" />
    </Row>
  )
}

function CalendarAndTableSkeleton() {
  return (
    <>
      <Skeleton className="h-[min(18rem,45vh)] w-full rounded-lg" />
      <Skeleton className="min-h-[200px] w-full rounded-lg" />
    </>
  )
}

type ForwardPricingPageSkeletonProps =
  | { variant: "full" }
  | {
      variant: "below-filters"
      /** Live filters between summary/context and calendar/table skeletons. */
      filterSlot: ReactNode
    }

export default function ForwardPricingPageSkeleton(props: ForwardPricingPageSkeletonProps) {
  return (
    <Col className="gap-5 md:gap-6" aria-busy="true" aria-label="Loading content">
      <SummaryAndContextSkeleton />
      {props.variant === "full" ? <FilterRowSkeleton /> : props.filterSlot}
      <CalendarAndTableSkeleton />
    </Col>
  )
}
