import { CSSProperties, ReactNode } from 'react'

export function TextMuted({
  children,
  className = '',
}: {
  children: ReactNode
  className?: CSSProperties | string
}) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  )
}
