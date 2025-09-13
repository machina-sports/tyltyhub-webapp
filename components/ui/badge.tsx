import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        bwin: "border-transparent bg-brand-primary text-bwin-neutral-0 hover:bg-brand-secondary",
        bwinOutline: "border-brand-primary text-brand-primary hover:bg-brand-primary/10",
        bwinSecondary: "border-transparent bg-brand-secondary text-bwin-neutral-0 hover:bg-brand-primary",
        bwinDark: "border-transparent bg-bwin-neutral-40 text-bwin-neutral-90 hover:bg-bwin-neutral-50",
        bwinDarkOutline: "border-bwin-neutral-40 text-bwin-neutral-90 hover:bg-bwin-neutral-40/10"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }