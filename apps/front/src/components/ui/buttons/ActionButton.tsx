import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@lib/utils'
import { Button } from './button'

const actionButtonVariants = cva(
  'uppercase no-underline inline-block transition-all duration-200 relative text-base cursor-pointer rounded-[6rem] border-none hover:-translate-y-[3px] hover:shadow-[0_0.5rem_1.15rem_rgba(0,0,0,0.2)] active:focus:outline-none active:focus:-translate-y-px active:focus:shadow-[0_0.5px_0.5rem_rgba(0,0,0,0.2)]  after:inline-block after:h-full after:w-full after:absolute after:-z-[1] after:transition-all after:duration-300 after:rounded-[3.5rem] after:left-0 after:-top-0 after:hover:opacity-0 after:hover:scale-x-[1.4] after:hover:scale-y-[1.6]',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground after:bg-accent',
        inverted:
          'bg-accent-foreground text-accent-gold-10 after:bg-accent-foreground border-[1px] border-accent-gold-4',
        outline:
          'border border-accent-gold-5 bg-foreground hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground after:bg-secondary',
        secondaryInverted:
          'bg-secondary-foreground text-secondary-gold-10 after:bg-secondary-foreground border-[1px] border-secondary-gold-4',
        secondaryLink:
          'text-secondary-sky-10 p-1 rounded-none border-b-secondary border-b border-solid hover:bg-secondary hover:text-secondary-foreground hover:shadow-[0_0.5rem_1.15rem_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:shadow-[0_0.15rem_0.5rem_rgba(0,0,0,0.15)] active:translate-y-0 after:hidden',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-accent-gold-10 p-1 rounded-none border-b-accent border-b border-solid hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0.5rem_1.15rem_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:shadow-[0_0.15rem_0.5rem_rgba(0,0,0,0.15)] active:translate-y-0 after:hidden',
      },
      size: {
        default: 'py-3 px-10',
        sm: 'py-2 px-6 text-sm',
        xs: 'py-1 px-3 text-xs',
        lg: 'py-4 px-12',
        icon: 'w-10',
      },
      animated: {
        default: '',
        moveInBottom: 'animate-move-in-bottom',
      },
      align: {
        default: 'text-center',
        left: 'text-left pl-1',
        right: 'text-left pr-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      align: 'default',
      animated: 'default',
    },
  },
)

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  asChild?: boolean
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    { className, variant, animated, align, size, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          actionButtonVariants({ variant, size, animated, align, className }),
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'ActionButton'

export { ActionButton, actionButtonVariants }
