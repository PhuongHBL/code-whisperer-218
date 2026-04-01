import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface TextPrimaryProps {
  text: string | null | undefined
  className: string | undefined
  uppercase?: boolean
  colon?: boolean
  dot?: boolean
  exclamation?: boolean
  reactNodeSuffix?: ReactNode
}

export default function TextPrimary({
  text,
  className,
  uppercase,
  colon,
  dot,
  exclamation,
  reactNodeSuffix,
}: TextPrimaryProps) {
  if (!text) return null

  let rendered = uppercase ? text.toUpperCase() : text
  if (colon) rendered += ":"
  if (dot) rendered += "."
  if (exclamation) rendered += "!"

  return (
    <span className={cn(className)}>
      {rendered}
      {reactNodeSuffix}
    </span>
  )
}
