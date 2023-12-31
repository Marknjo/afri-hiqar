import { CSSProperties, ElementType, ReactNode, createElement } from 'react'
import { TLayoutProps } from './Wrapper'

export default function SectionLayout({
  as,
  children,
  className = '',
  ...props
}: {
  as?: ElementType
  children: ReactNode
  className?: CSSProperties | string
  props?: TLayoutProps
}) {
  const propsWithDefault = {
    ...props,
    className: `grid grid-cols-sec-sm md:grid-cols-sec-md lg:grid-cols-sec-lg gap-2 md:gap-x-5 lg:gap-x-8 min-h-screen w-full col-start-1 col-span-12`,
  }

  return createElement(as || 'section', propsWithDefault, children)
}
