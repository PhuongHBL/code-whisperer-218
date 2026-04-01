import { cn } from "@/lib/utils"
import { forwardRef, type InputHTMLAttributes } from "react"

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string | undefined
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-[0.375rem]">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-surface-container-low border-0 ring-1 ring-outline-variant/50",
            "focus:ring-2 focus:ring-surface-tint rounded-lg py-3 px-4",
            "text-on-surface text-sm transition-all outline-none",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
BaseInput.displayName = "BaseInput"

export default BaseInput
