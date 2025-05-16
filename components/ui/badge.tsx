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
        sportingbet: "border-transparent bg-[#0A5EEA] text-white hover:bg-[#003DC4]",
        sportingbetOutline: "border-[#0A5EEA] text-[#0A5EEA] hover:bg-[#0A5EEA]/10",
        palmeiras: "border-transparent bg-[#006B3D] text-white hover:bg-[#00502E]",
        palmeirasOutline: "border-[#006B3D] text-[#006B3D] hover:bg-[#006B3D]/10"
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
  const { isPalmeirasTheme } = useTheme();
  
  // Auto-convert Sportingbet variants to Palmeiras variants when theme is active
  if (isPalmeirasTheme) {
    if (variant === 'sportingbet') {
      variant = 'palmeiras';
    } else if (variant === 'sportingbetOutline') {
      variant = 'palmeirasOutline';
    }
  }
  
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }