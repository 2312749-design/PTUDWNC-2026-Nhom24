import { cva } from 'class-variance-authority'

export const buttonVariants = cva('cb-button', {
  variants: {
    variant: { primary: 'cb-button--primary', secondary: 'cb-button--secondary', ghost: 'cb-button--ghost', danger: 'cb-button--danger' },
    size: { sm: 'cb-button--sm', md: 'cb-button--md', lg: 'cb-button--lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})
