import { CSSProperties, ReactNode } from 'react'

export function TextLarge({
  children,
  className = '',
}: {
  children: ReactNode
  className?: CSSProperties | string
}) {
  return <p className={`text-lg font-semibold ${className}`}>{children}</p>
}
