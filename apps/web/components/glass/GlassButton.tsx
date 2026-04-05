import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'soft' | 'primary' | 'cta'
  asChild?: boolean
}

export function GlassButton({ className, variant = 'soft', children, ...props }: GlassButtonProps) {
  return (
    <button
      className={cn(
        variant === 'cta' && 'cta-button',
        variant === 'soft' && 'soft-button',
        variant === 'primary' && 'soft-button primary',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
