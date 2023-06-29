import { CSSProperties, ReactNode } from 'react'

export function Heading3({
  children,
  className = '',
}: {
  children: ReactNode
  className?: CSSProperties | string
}) {
  return (
    <h2
      className={`scroll-m-20 text-2xl font-normal tracking-tight ${className}`}
    >
      {children}
    </h2>
  )
}
