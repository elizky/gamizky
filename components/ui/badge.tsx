import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 rounded-full",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 rounded-full",
        outline: "text-foreground rounded-full",
        // Neo-brutalist variants
        neo: "bg-yellow-400 text-black border-2 border-black font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5",
        "neo-primary": "bg-blue-400 text-black border-2 border-black font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5",
        "neo-success": "bg-green-400 text-black border-2 border-black font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5",
        "neo-danger": "bg-red-400 text-black border-2 border-black font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5",
        "neo-outline": "bg-white text-black border-2 border-black font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5",
        // Variantes específicas para recompensas
        "reward-coin": "bg-yellow-400 text-black border border-black font-number font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] px-2 py-1 text-xs",
        "reward-xp": "bg-blue-400 text-white border border-black font-number font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] px-2 py-1 text-xs",
        // Variantes para dificultad + categoría
        "difficulty-easy": "bg-green-500 text-white border-2 border-black font-display font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] px-3 py-1 text-xs",
        "difficulty-medium": "bg-yellow-500 text-white border-2 border-black font-display font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] px-3 py-1 text-xs",
        "difficulty-hard": "bg-red-500 text-white border-2 border-black font-display font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] px-3 py-1 text-xs",
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
