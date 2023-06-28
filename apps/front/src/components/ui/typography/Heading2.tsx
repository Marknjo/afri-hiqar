import { CSSProperties, ReactNode } from 'react'

export function Heading2({
  children,
  className = '',
}: {
  children: ReactNode
  className?: CSSProperties | string
}) {
  return (
    <h2
      className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 ${className}`}
    >
      {children}
    </h2>
  )
}
