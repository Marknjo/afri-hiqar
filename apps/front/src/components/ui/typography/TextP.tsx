import { CSSProperties, ReactNode } from 'react'

export function TextP({
  children,
  className = '',
}: {
  children: ReactNode
  className?: CSSProperties | string
}) {
  return (
    <p className={`leading-7 [&:not(:first-child)]:mt-4 ${className}`}>
      {children}
    </p>
  )
}
