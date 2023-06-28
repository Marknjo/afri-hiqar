import { ReactNode } from 'react'

export default function CenterContentWrapper({
  children,
}: {
  children: ReactNode
}) {
  return <div className="flex flex-col w-full h-full">{children}</div>
}
