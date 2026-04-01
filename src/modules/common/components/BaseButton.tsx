import { cn } from "@/lib/utils"
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"

const baseButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 outline-none disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        filled: "bg-primary text-primary-foreground hover:opacity-95 shadow-lg shadow-primary/10 hover:shadow-primary/20",
        "filled-gradient": "bg-gradient-to-br from-primary to-primary-container text-primary-foreground hover:opacity-95 shadow-lg shadow-primary/10 hover:shadow-primary/20",
        bordered: "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low",
        light: "bg-transparent text-primary hover:bg-surface-container-low",
      },
      size: {
        sm: "py-2 px-3 text-xs rounded-md",
        md: "py-3 px-4 text-sm rounded-lg",
        lg: "py-4 px-6 text-sm rounded-lg",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "md",
    },
  }
)

interface BaseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof baseButtonVariants> {
  isLoading?: boolean
  isDisabled?: boolean
  children: ReactNode
}

const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ className, variant, size, isLoading, isDisabled, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(baseButtonVariants({ variant, size }), isLoading && "opacity-70", className)}
      disabled={disabled || isDisabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
)
BaseButton.displayName = "BaseButton"

export default BaseButton
