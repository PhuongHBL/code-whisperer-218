import { cn } from "@/lib/utils"
import { forwardRef, type HTMLAttributes } from "react"

const Row = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-row", className)} {...props} />
  )
)
Row.displayName = "Row"

export default Row
