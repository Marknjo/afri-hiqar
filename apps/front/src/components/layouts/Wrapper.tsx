import {
  CSSProperties,
  DetailedHTMLProps,
  ElementType,
  HTMLAttributes,
  ReactNode,
  createElement,
} from 'react'

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
  as?: ElementType
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
