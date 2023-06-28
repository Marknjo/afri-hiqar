import {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  createElement,
} from 'react'

import { TElements } from '@lib/types'

export type TLayoutProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>

export default function Wrapper({
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
    className: `col-start-1 col-span-12 relative ${className}`,
  }

  return createElement(as || 'section', propsWithDefault, children)
}
