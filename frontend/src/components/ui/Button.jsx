'use client'

import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva('cb-button', {
  variants: {
    variant: { primary: 'cb-button--primary', secondary: 'cb-button--secondary', ghost: 'cb-button--ghost', danger: 'cb-button--danger' },
    size: { sm: 'cb-button--sm', md: 'cb-button--md', lg: 'cb-button--lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
