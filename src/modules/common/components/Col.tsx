import { cn } from "@/lib/utils"
import { forwardRef, type HTMLAttributes } from "react"

const Col = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col", className)} {...props} />
  )
)
Col.displayName = "Col"

export default Col
