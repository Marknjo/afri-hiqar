import { CSSProperties, ReactNode, createElement } from 'react'
import { TElements } from '@lib/types'
import { TLayoutProps } from './Wrapper'

export default function SectionLayout({
  as,
  children,
  className = '',
  ...props
}: {
  as?: TElements
  children: ReactNode
  className?: CSSProperties | string
  props?: TLayoutProps
}) {
  const propsWithDefault = {
    ...props,
    className: `grid grid-cols-sec-sm md:grid-cols-sec-md lg:grid-cols-sec-lg gap-2 md:gap-5 lg:gap-8 min-h-screen w-screen  ${className}`,
  }

  return createElement(as || 'section', propsWithDefault, children)
}
