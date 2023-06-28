import { CSSProperties, ReactNode, createElement } from 'react'
import { TElements } from '@lib/types'
import { TLayoutProps } from './Wrapper'

export default function Layout({
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
    className: `grid grid-cols-layout-sm md:grid-cols-layout-md lg:grid-cols-layout-lg gap-2 md:gap-8 min-h-screen w-screen  ${className}`,
  }

  return createElement(as || 'main', propsWithDefault, children)
}
