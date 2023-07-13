import { CSSProperties, ReactNode } from 'react'

export function TextLead({
  children,
  className = '',
}: {
  children: ReactNode
  className?: CSSProperties | string
}) {
  return (
    <p className={`text-xl text-muted-foreground ${className}`}>{children}</p>
  )
}
