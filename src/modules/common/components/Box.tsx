import { cn } from "@/lib/utils"
import { forwardRef, type HTMLAttributes } from "react"

const Box = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props} />
  )
)
Box.displayName = "Box"

export default Box
