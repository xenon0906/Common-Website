import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-[#0a3577] hover:text-white hover:scale-105 hover:shadow-xl shadow-md',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg',
        outline: 'border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400 shadow-sm hover:shadow-md',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg',
        ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient: 'bg-gradient-to-r from-primary via-primary/80 to-teal text-white hover:text-white hover:shadow-2xl hover:scale-105 shadow-xl shadow-primary/30',
        teal: 'bg-teal text-white hover:bg-[#0f766e] hover:text-white hover:scale-105 shadow-lg shadow-teal/30 hover:shadow-xl',
        'primary-solid': 'bg-primary text-white hover:bg-[#0a3577] hover:text-white hover:scale-105 shadow-lg shadow-primary/30 hover:shadow-xl',
        'glow': 'bg-gradient-to-r from-teal to-primary text-white hover:text-white shadow-lg shadow-teal/40 hover:shadow-[0_0_30px_rgba(13,148,136,0.5)] hover:scale-105 border border-teal/30',
        'glass': 'bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 hover:text-white hover:border-white/50 shadow-lg',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-10 rounded-lg px-4',
        lg: 'h-12 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-11 w-11 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
