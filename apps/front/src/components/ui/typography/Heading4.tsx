import { CSSProperties, ReactNode } from 'react'

export function Heading4({
  children,
  className = '',
}: {
  children: ReactNode
  className?: CSSProperties | string
}) {
  return (
    <h2
      className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h2>
  )
}
