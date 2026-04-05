import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'organic'
}

export function GlassCard({ className, variant = 'default', children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass',
        variant === 'organic' && 'organic-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
