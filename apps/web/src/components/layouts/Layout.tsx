import { CSSProperties, ElementType, ReactNode, createElement } from 'react'
import { TLayoutProps } from './Wrapper'

export default function Layout({
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
    className: `grid grid-cols-layout-sm md:grid-cols-layout-md lg:grid-cols-layout-lg gap-x-2 md:gap-x-8 min-h-screen w-full  ${className}`,
  }

  return createElement(as || 'main', propsWithDefault, children)
}
