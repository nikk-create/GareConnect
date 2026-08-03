import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-xl border border-input bg-muted/50 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
      className
    )}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
