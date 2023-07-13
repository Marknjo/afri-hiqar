import { CSSProperties, ReactNode } from 'react'

export function TextSmall({
  children,
  className = '',
}: {
  children: ReactNode
  className?: CSSProperties | string
}) {
  return (
    <small className={`text-sm font-medium leading-none ${className}`}>
      {children}
    </small>
  )
}
